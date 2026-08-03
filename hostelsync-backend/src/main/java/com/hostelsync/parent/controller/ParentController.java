package com.hostelsync.parent.controller;

import com.hostelsync.parent.dto.ParentDashboardDto;
import com.hostelsync.parent.service.ParentService;
import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PARENT')")
@Tag(name = "Parent Module", description = "Parent Monitoring Portal for Linked Ward Only")
public class ParentController {

    private final ParentService parentService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Linked Child Hostel Overview")
    public ResponseEntity<ApiResponse<ParentDashboardDto>> getDashboard(Authentication authentication) {
        ParentDashboardDto response = parentService.getParentDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Parent dashboard fetched", response));
    }
}
