package com.hostelsync.complaint.controller;

import com.hostelsync.complaint.dto.CreateComplaintRequest;
import com.hostelsync.complaint.dto.UpdateComplaintRequest;
import com.hostelsync.complaint.entity.Complaint;
import com.hostelsync.complaint.service.ComplaintService;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.enums.ComplaintStatus;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaint Module", description = "Complaint Ticketing, Resolution Workflow & Rating")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Raise New Complaint (Student)")
    public ResponseEntity<ApiResponse<Complaint>> raiseComplaint(
            @Valid @RequestPart("request") CreateComplaintRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            Authentication authentication) {
        Complaint response = complaintService.raiseComplaint(request, photo, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get Student Complaints History")
    public ResponseEntity<ApiResponse<List<Complaint>>> getStudentComplaints(Authentication authentication) {
        List<Complaint> response = complaintService.getStudentComplaints(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get All Complaints Filtered By Status")
    public ResponseEntity<ApiResponse<Page<Complaint>>> getComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            Pageable pageable) {
        Page<Complaint> response = complaintService.getComplaintsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved", response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Update Complaint Status (ASSIGNED / IN_PROGRESS / RESOLVED / CLOSED)")
    public ResponseEntity<ApiResponse<Complaint>> updateComplaintStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateComplaintRequest request,
            Authentication authentication) {
        Complaint response = complaintService.updateComplaintStatus(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated", response));
    }

    @PostMapping("/{id}/rate")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Rate Resolved Complaint Service Quality (1 to 5 Stars)")
    public ResponseEntity<ApiResponse<Complaint>> rateResolution(
            @PathVariable UUID id,
            @RequestParam int rating,
            Authentication authentication) {
        Complaint response = complaintService.rateResolution(id, rating, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Complaint rating submitted", response));
    }
}
