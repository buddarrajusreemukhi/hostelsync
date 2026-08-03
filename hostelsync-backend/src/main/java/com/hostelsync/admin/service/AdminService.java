package com.hostelsync.admin.service;

import com.hostelsync.admin.dto.AdminDashboardDto;
import com.hostelsync.admin.dto.LinkParentStudentRequest;
import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.shared.entity.AuditLog;
import com.hostelsync.shared.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminService {

    AdminDashboardDto getDashboardStats();

    Page<UserDto> getPendingApprovals(Pageable pageable);

    UserDto approveUser(UUID userId);

    UserDto rejectUser(UUID userId);

    Page<UserDto> getUsers(UserStatus status, Pageable pageable);

    UserDto updateUserStatus(UUID userId, UserStatus status);

    void linkParentStudent(LinkParentStudentRequest request);

    Page<AuditLog> getAuditLogs(Pageable pageable);
}
