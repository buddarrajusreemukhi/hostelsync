package com.hostelsync.report.controller;

import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('WARDEN')")
@Tag(name = "Report Engine", description = "Export System Reports in CSV/PDF")
public class ReportController {

    @GetMapping("/export")
    @Operation(summary = "Export Module Report as CSV")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam String type,
            @RequestParam(required = false, defaultValue = "csv") String format) {

        String csvHeader = "ID,Category,Date,Status,Details\n";
        String csvContent = csvHeader +
                "1,Attendance,2026-08-02,COMPLETED,All 3 sessions marked\n" +
                "2,GatePass,2026-08-02,APPROVED,Generated QR pass GP-10928\n" +
                "3,Complaint,2026-08-02,RESOLVED,Internet Wi-Fi router reset\n";

        byte[] output = csvContent.getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + type + "-report." + format);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(output);
    }
}
