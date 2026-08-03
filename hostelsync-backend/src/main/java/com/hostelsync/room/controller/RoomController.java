package com.hostelsync.room.controller;

import com.hostelsync.room.entity.Hostel;
import com.hostelsync.room.entity.Room;
import com.hostelsync.room.repository.HostelRepository;
import com.hostelsync.room.repository.RoomRepository;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.exception.BadRequestException;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Room & Hostel Management Module", description = "Hostel Structure, Capacity & Student Room Allocation")
public class RoomController {

    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Data
    public static class AllocateRoomRequest {
        private UUID studentId;
        private UUID roomId;
    }

    @GetMapping("/structure")
    @Operation(summary = "Get Complete Hostel Hierarchy (Hostels -> Blocks -> Floors -> Rooms)")
    public ResponseEntity<ApiResponse<List<Hostel>>> getHostelStructure() {
        List<Hostel> structure = hostelRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Hostel structure fetched", structure));
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARDEN')")
    @Operation(summary = "Allocate Student to Hostel Room")
    public ResponseEntity<ApiResponse<StudentProfile>> allocateRoom(@RequestBody AllocateRoomRequest request) {
        StudentProfile student = studentProfileRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            throw new BadRequestException("Room is already full");
        }

        // Decrement previous room occupancy if assigned
        if (student.getRoom() != null) {
            Room oldRoom = student.getRoom();
            oldRoom.setCurrentOccupancy(Math.max(0, oldRoom.getCurrentOccupancy() - 1));
            roomRepository.save(oldRoom);
        }

        student.setRoom(room);
        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);

        roomRepository.save(room);
        StudentProfile saved = studentProfileRepository.save(student);

        return ResponseEntity.ok(ApiResponse.success("Student room allocated successfully", saved));
    }
}
