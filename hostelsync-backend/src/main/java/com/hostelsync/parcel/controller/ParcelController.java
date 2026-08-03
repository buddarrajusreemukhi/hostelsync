package com.hostelsync.parcel.controller;

import com.hostelsync.parcel.dto.AddParcelRequest;
import com.hostelsync.parcel.entity.Parcel;
import com.hostelsync.parcel.service.ParcelService;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.enums.ParcelStatus;
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
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
@Tag(name = "Parcel Module", description = "Parcel Entry by Warden & QR Verification Pickup")
public class ParcelController {

    private final ParcelService parcelService;

    @PostMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Log Incoming Parcel Arrival (Warden Only)")
    public ResponseEntity<ApiResponse<Parcel>> addParcel(
            @Valid @RequestBody AddParcelRequest request,
            Authentication authentication) {
        Parcel response = parcelService.addParcel(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Parcel logged and student/parent notified", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get Student Parcels History")
    public ResponseEntity<ApiResponse<List<Parcel>>> getStudentParcels(Authentication authentication) {
        List<Parcel> response = parcelService.getStudentParcels(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Parcels retrieved", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get All Parcels Filtered By Status")
    public ResponseEntity<ApiResponse<Page<Parcel>>> getParcels(
            @RequestParam(required = false) ParcelStatus status,
            Pageable pageable) {
        Page<Parcel> response = parcelService.getParcelsByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Parcels retrieved", response));
    }

    @PutMapping("/{id}/collect")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Mark Parcel as Collected")
    public ResponseEntity<ApiResponse<Parcel>> markAsCollected(@PathVariable UUID id) {
        Parcel response = parcelService.markAsCollected(id);
        return ResponseEntity.ok(ApiResponse.success("Parcel marked as collected", response));
    }
}
