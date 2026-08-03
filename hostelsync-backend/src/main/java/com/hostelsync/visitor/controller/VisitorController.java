package com.hostelsync.visitor.controller;

import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import com.hostelsync.visitor.entity.Visitor;
import com.hostelsync.visitor.repository.VisitorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@Tag(name = "Visitor Management Module", description = "Hostel Visitor Entry & Exit Register")
public class VisitorController {

    private final VisitorRepository visitorRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Data
    public static class AddVisitorRequest {
        private UUID studentId;
        private String visitorName;
        private String relation;
        private String phoneNumber;
        private String purpose;
    }

    @PostMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Log Visitor Entry (Warden)")
    public ResponseEntity<ApiResponse<Visitor>> logVisitorEntry(@RequestBody AddVisitorRequest request, Authentication authentication) {
        User warden = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        StudentProfile student = studentProfileRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Visitor visitor = Visitor.builder()
                .student(student)
                .visitorName(request.getVisitorName())
                .relation(request.getRelation())
                .phoneNumber(request.getPhoneNumber())
                .purpose(request.getPurpose())
                .entryTime(LocalDateTime.now())
                .approvedBy(warden)
                .build();

        Visitor saved = visitorRepository.save(visitor);
        return ResponseEntity.ok(ApiResponse.success("Visitor entry logged", saved));
    }

    @PutMapping("/{id}/exit")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Log Visitor Exit Time")
    public ResponseEntity<ApiResponse<Visitor>> logVisitorExit(@PathVariable UUID id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor entry not found"));

        visitor.setExitTime(LocalDateTime.now());
        Visitor saved = visitorRepository.save(visitor);
        return ResponseEntity.ok(ApiResponse.success("Visitor exit recorded", saved));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get Visitor Register Logs")
    public ResponseEntity<ApiResponse<Page<Visitor>>> getVisitorRegister(Pageable pageable) {
        Page<Visitor> response = visitorRepository.findAllByOrderByEntryTimeDesc(pageable);
        return ResponseEntity.ok(ApiResponse.success("Visitor register fetched", response));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get Visitor History for Student")
    public ResponseEntity<ApiResponse<List<Visitor>>> getStudentVisitors(@PathVariable UUID studentId) {
        List<Visitor> response = visitorRepository.findByStudentIdOrderByEntryTimeDesc(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student visitor history fetched", response));
    }
}
