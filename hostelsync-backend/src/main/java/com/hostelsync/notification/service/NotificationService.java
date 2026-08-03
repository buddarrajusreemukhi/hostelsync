package com.hostelsync.notification.service;

import com.hostelsync.auth.entity.User;
import com.hostelsync.notification.entity.Notification;
import com.hostelsync.shared.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NotificationService {

    Notification createAndSendNotification(User user, String title, String message, NotificationType type);

    Page<Notification> getUserNotifications(String userEmail, Pageable pageable);

    void markAsRead(UUID notificationId, String userEmail);

    long getUnreadCount(String userEmail);
}
