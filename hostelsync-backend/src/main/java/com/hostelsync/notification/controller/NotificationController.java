package com.hostelsync.notification.controller;

import com.hostelsync.notification.entity.Notification;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Engine", description = "In-App & WebSocket Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get User Notifications")
    public ResponseEntity<ApiResponse<Page<Notification>>> getUserNotifications(Authentication authentication, Pageable pageable) {
        Page<Notification> response = notificationService.getUserNotifications(authentication.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", response));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark Notification As Read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id, Authentication authentication) {
        notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get Unread Notifications Count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched", count));
    }
}
