package com.hostelsync.warden.controller;

import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.warden.dto.WardenDashboardDto;
import com.hostelsync.warden.service.WardenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warden")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WARDEN')")
@Tag(name = "Warden Module", description = "Daily Hostel Operations Dashboard & Student Directory")
public class WardenController {

    private final WardenService wardenService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Warden Dashboard Metrics")
    public ResponseEntity<ApiResponse<WardenDashboardDto>> getDashboardStats() {
        WardenDashboardDto response = wardenService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Warden dashboard stats fetched", response));
    }

    @GetMapping("/students")
    @Operation(summary = "Get Paginated & Filtered Student List")
    public ResponseEntity<ApiResponse<Page<StudentProfile>>> getStudents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<StudentProfile> response = wardenService.getStudents(department, year, search, pageable);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", response));
    }
}
