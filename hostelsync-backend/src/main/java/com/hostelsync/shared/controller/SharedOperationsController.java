package com.hostelsync.shared.controller;

import com.hostelsync.notification.entity.Announcement;
import com.hostelsync.notification.repository.AnnouncementRepository;
import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.shared.entity.MessMenu;
import com.hostelsync.shared.repository.MessMenuRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shared")
@RequiredArgsConstructor
@Tag(name = "Shared Features", description = "Mess Menu & Hostel Announcements")
public class SharedOperationsController {

    private final MessMenuRepository messMenuRepository;
    private final AnnouncementRepository announcementRepository;

    @GetMapping("/mess-menu")
    @Operation(summary = "Get Weekly Hostel Mess Menu")
    public ResponseEntity<ApiResponse<List<MessMenu>>> getMessMenu() {
        List<MessMenu> menu = messMenuRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Mess menu fetched", menu));
    }

    @GetMapping("/announcements")
    @Operation(summary = "Get All Active Hostel Announcements")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(ApiResponse.success("Announcements fetched", announcements));
    }
}
