package com.hostelsync.attendance.controller;

import com.hostelsync.attendance.dto.BulkAttendanceRequest;
import com.hostelsync.attendance.entity.AttendanceRecord;
import com.hostelsync.attendance.service.AttendanceService;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.enums.AttendanceSession;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Tag(name = "Attendance Module", description = "Morning, Afternoon, Evening Attendance Tracking")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Submit Bulk Session Attendance (Warden Only)")
    public ResponseEntity<ApiResponse<Void>> markBulkAttendance(
            @Valid @RequestBody BulkAttendanceRequest request,
            Authentication authentication) {
        attendanceService.markBulkAttendance(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Attendance submitted successfully", null));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get Attendance History for Specific Student")
    public ResponseEntity<ApiResponse<List<AttendanceRecord>>> getStudentAttendanceHistory(@PathVariable UUID studentId) {
        List<AttendanceRecord> response = attendanceService.getStudentAttendanceHistory(studentId);
        return ResponseEntity.ok(ApiResponse.success("Attendance history fetched", response));
    }

    @GetMapping("/session")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get Session Attendance Sheet")
    public ResponseEntity<ApiResponse<List<AttendanceRecord>>> getSessionAttendance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceSession session) {
        List<AttendanceRecord> response = attendanceService.getSessionAttendance(date, session);
        return ResponseEntity.ok(ApiResponse.success("Session attendance fetched", response));
    }
}
