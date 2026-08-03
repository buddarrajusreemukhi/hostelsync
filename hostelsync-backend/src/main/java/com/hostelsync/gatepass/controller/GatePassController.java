package com.hostelsync.gatepass.controller;

import com.hostelsync.gatepass.dto.CreateGatePassRequest;
import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.gatepass.entity.GatePassReceipt;
import com.hostelsync.gatepass.service.GatePassService;
import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gatepass")
@RequiredArgsConstructor
@Tag(name = "Gate Pass Module", description = "Gate Pass Application, Warden Approval & PDF Receipts")
public class GatePassController {

    private final GatePassService gatePassService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply for Gate Pass (Student Only)")
    public ResponseEntity<ApiResponse<GatePass>> applyGatePass(
            @Valid @RequestBody CreateGatePassRequest request,
            Authentication authentication) {
        GatePass response = gatePassService.applyGatePass(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Gate pass application submitted", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get Student Gate Pass History")
    public ResponseEntity<ApiResponse<List<GatePass>>> getStudentGatePasses(Authentication authentication) {
        List<GatePass> response = gatePassService.getStudentGatePasses(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Gate passes retrieved", response));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Get Pending Gate Pass Applications (Warden/Admin)")
    public ResponseEntity<ApiResponse<Page<GatePass>>> getPendingGatePasses(Pageable pageable) {
        Page<GatePass> response = gatePassService.getPendingGatePasses(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending gate passes retrieved", response));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Approve Gate Pass & Generate QR Receipt")
    public ResponseEntity<ApiResponse<GatePass>> approveGatePass(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "Approved") String remarks,
            Authentication authentication) {
        GatePass response = gatePassService.approveGatePass(id, authentication.getName(), remarks);
        return ResponseEntity.ok(ApiResponse.success("Gate pass approved and digital receipt generated", response));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('WARDEN') or hasRole('ADMIN')")
    @Operation(summary = "Reject Gate Pass")
    public ResponseEntity<ApiResponse<GatePass>> rejectGatePass(
            @PathVariable UUID id,
            @RequestParam String remarks,
            Authentication authentication) {
        GatePass response = gatePassService.rejectGatePass(id, authentication.getName(), remarks);
        return ResponseEntity.ok(ApiResponse.success("Gate pass rejected", response));
    }

    @GetMapping("/{id}/receipt/pdf")
    @Operation(summary = "Download Official Gate Pass PDF Receipt")
    public ResponseEntity<InputStreamResource> downloadReceiptPdf(@PathVariable UUID id) {
        ByteArrayInputStream pdfStream = gatePassService.downloadReceiptPdf(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=gatepass-receipt-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdfStream));
    }

    @GetMapping("/{id}/receipt")
    @Operation(summary = "Get Gate Pass Receipt Details")
    public ResponseEntity<ApiResponse<GatePassReceipt>> getReceiptDetails(@PathVariable UUID id) {
        GatePassReceipt response = gatePassService.getReceiptDetails(id);
        return ResponseEntity.ok(ApiResponse.success("Receipt details retrieved", response));
    }
}
