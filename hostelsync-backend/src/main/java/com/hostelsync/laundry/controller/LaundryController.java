package com.hostelsync.laundry.controller;

import com.hostelsync.laundry.dto.CreateLaundryRequest;
import com.hostelsync.laundry.entity.LaundryRequest;
import com.hostelsync.laundry.service.LaundryService;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.enums.LaundryStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/laundry")
@RequiredArgsConstructor
@Tag(name = "Laundry Module", description = "Laundry Requests Tracking & Workflow Lifecycle")
public class LaundryController {

    private final LaundryService laundryService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit Laundry Request (Student)")
    public ResponseEntity<ApiResponse<LaundryRequest>> submitLaundryRequest(
            @Valid @RequestBody CreateLaundryRequest request,
            Authentication authentication) {
        LaundryRequest response = laundryService.submitLaundryRequest(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Laundry request submitted", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get Student Laundry History")
    public ResponseEntity<ApiResponse<List<LaundryRequest>>> getStudentLaundryRequests(Authentication authentication) {
        List<LaundryRequest> response = laundryService.getStudentLaundryRequests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Laundry history fetched", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get Laundry Requests Filtered By Status (Warden/Admin)")
    public ResponseEntity<ApiResponse<Page<LaundryRequest>>> getLaundryRequests(
            @RequestParam(required = false) LaundryStatus status,
            Pageable pageable) {
        Page<LaundryRequest> response = laundryService.getLaundryRequestsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Laundry requests retrieved", response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Update Laundry Request Status (ACCEPTED / IN_PROGRESS / READY / COLLECTED)")
    public ResponseEntity<ApiResponse<LaundryRequest>> updateLaundryStatus(
            @PathVariable UUID id,
            @RequestParam LaundryStatus status) {
        LaundryRequest response = laundryService.updateLaundryStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Laundry status updated", response));
    }
}
