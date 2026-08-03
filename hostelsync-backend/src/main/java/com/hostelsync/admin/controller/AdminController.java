package com.hostelsync.admin.controller;

import com.hostelsync.admin.dto.AdminDashboardDto;
import com.hostelsync.admin.dto.LinkParentStudentRequest;
import com.hostelsync.admin.service.AdminService;
import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.entity.AuditLog;
import com.hostelsync.shared.enums.UserStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Module", description = "Admin Dashboard, User Approvals, Linkage & Audit Logs")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Admin SaaS Dashboard KPIs & Statistics")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        AdminDashboardDto response = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved", response));
    }

    @GetMapping("/approvals")
    @Operation(summary = "Get Pending Student & Parent Registrations")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getPendingApprovals(Pageable pageable) {
        Page<UserDto> response = adminService.getPendingApprovals(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending approvals fetched", response));
    }

    @PostMapping("/approvals/{userId}/approve")
    @Operation(summary = "Approve Pending User Account")
    public ResponseEntity<ApiResponse<UserDto>> approveUser(@PathVariable UUID userId) {
        UserDto response = adminService.approveUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User account approved successfully", response));
    }

    @PostMapping("/approvals/{userId}/reject")
    @Operation(summary = "Reject Pending User Account")
    public ResponseEntity<ApiResponse<UserDto>> rejectUser(@PathVariable UUID userId) {
        UserDto response = adminService.rejectUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User account rejected", response));
    }

    @GetMapping("/users")
    @Operation(summary = "Get Paginated Users List Filtered By Status")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsers(
            @RequestParam(required = false) UserStatus status,
            Pageable pageable) {
        Page<UserDto> response = adminService.getUsers(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", response));
    }

    @PutMapping("/users/{userId}/status")
    @Operation(summary = "Update User Account Status (SUSPENDED / APPROVED)")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable UUID userId,
            @RequestParam UserStatus status) {
        UserDto response = adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated", response));
    }

    @PostMapping("/link-parent-student")
    @Operation(summary = "Link Parent Profile to Student Profile")
    public ResponseEntity<ApiResponse<Void>> linkParentStudent(@Valid @RequestBody LinkParentStudentRequest request) {
        adminService.linkParentStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Parent and Student linked successfully", null));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Fetch System Activity Audit Logs")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(Pageable pageable) {
        Page<AuditLog> response = adminService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success("Audit logs fetched", response));
    }
}
