package com.hostelsync.admin.service;

import com.hostelsync.admin.dto.AdminDashboardDto;
import com.hostelsync.admin.dto.LinkParentStudentRequest;
import com.hostelsync.attendance.repository.AttendanceRecordRepository;
import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.complaint.repository.ComplaintRepository;
import com.hostelsync.gatepass.repository.GatePassRepository;
import com.hostelsync.laundry.repository.LaundryRequestRepository;
import com.hostelsync.parcel.repository.ParcelRepository;
import com.hostelsync.parent.entity.ParentProfile;
import com.hostelsync.parent.entity.StudentParentMapping;
import com.hostelsync.parent.repository.ParentProfileRepository;
import com.hostelsync.parent.repository.StudentParentMappingRepository;
import com.hostelsync.room.repository.HostelRepository;
import com.hostelsync.room.repository.RoomRepository;
import com.hostelsync.shared.entity.AuditLog;
import com.hostelsync.shared.enums.*;
import com.hostelsync.shared.exception.BadRequestException;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.shared.repository.AuditLogRepository;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final StudentParentMappingRepository studentParentMappingRepository;
    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final ComplaintRepository complaintRepository;
    private final GatePassRepository gatePassRepository;
    private final LaundryRequestRepository laundryRequestRepository;
    private final ParcelRepository parcelRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public AdminDashboardDto getDashboardStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalParents = userRepository.countByRole(Role.PARENT);
        long totalWardens = userRepository.countByRole(Role.WARDEN);
        long pendingApprovals = userRepository.countByStatus(UserStatus.PENDING_APPROVAL);

        int totalCapacity = hostelRepository.findAll().stream().mapToInt(h -> h.getCapacity()).sum();
        if (totalCapacity == 0) totalCapacity = 500;

        int occupiedBeds = roomRepository.findAll().stream().mapToInt(r -> r.getCurrentOccupancy()).sum();
        int availableBeds = Math.max(0, totalCapacity - occupiedBeds);

        LocalDate today = LocalDate.now();
        long todayPresentCount = attendanceRecordRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT);
        long todayAbsentCount = attendanceRecordRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.ABSENT);

        long pendingComplaints = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long pendingGatePasses = gatePassRepository.countByStatus(GatePassStatus.PENDING);
        long pendingLaundry = laundryRequestRepository.countByStatus(LaundryStatus.PENDING);
        long pendingParcels = parcelRepository.countByStatus(ParcelStatus.PENDING);

        return AdminDashboardDto.builder()
                .totalStudents(totalStudents)
                .totalParents(totalParents)
                .totalWardens(totalWardens)
                .pendingApprovals(pendingApprovals)
                .totalCapacity(totalCapacity)
                .occupiedBeds(occupiedBeds)
                .availableBeds(availableBeds)
                .todayPresentCount(todayPresentCount)
                .todayAbsentCount(todayAbsentCount)
                .pendingComplaintsCount(pendingComplaints)
                .pendingGatePassesCount(pendingGatePasses)
                .pendingLaundryCount(pendingLaundry)
                .pendingParcelsCount(pendingParcels)
                .build();
    }

    @Override
    public Page<UserDto> getPendingApprovals(Pageable pageable) {
        return userRepository.findByStatus(UserStatus.PENDING_APPROVAL, pageable).map(this::mapToUserDto);
    }

    @Override
    @Transactional
    public UserDto approveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(UserStatus.APPROVED);
        User savedUser = userRepository.save(user);

        // Audit Log
        auditLogRepository.save(AuditLog.builder()
                .user(savedUser)
                .userEmail(savedUser.getEmail())
                .action("ADMIN_APPROVE_USER")
                .details("Admin approved registration for user " + savedUser.getEmail())
                .build());

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto rejectUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(UserStatus.REJECTED);
        User savedUser = userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .user(savedUser)
                .userEmail(savedUser.getEmail())
                .action("ADMIN_REJECT_USER")
                .details("Admin rejected registration for user " + savedUser.getEmail())
                .build());

        return mapToUserDto(savedUser);
    }

    @Override
    public Page<UserDto> getUsers(UserStatus status, Pageable pageable) {
        if (status != null) {
            return userRepository.findByStatus(status, pageable).map(this::mapToUserDto);
        }
        return userRepository.findAll(pageable).map(this::mapToUserDto);
    }

    @Override
    @Transactional
    public UserDto updateUserStatus(UUID userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        User savedUser = userRepository.save(user);

        auditLogRepository.save(AuditLog.builder()
                .user(savedUser)
                .userEmail(savedUser.getEmail())
                .action("ADMIN_UPDATE_STATUS")
                .details("Updated status of user " + savedUser.getEmail() + " to " + status)
                .build());

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public void linkParentStudent(LinkParentStudentRequest request) {
        StudentProfile student = studentProfileRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        ParentProfile parent = parentProfileRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found"));

        if (studentParentMappingRepository.existsByStudentIdAndParentId(student.getId(), parent.getId())) {
            throw new BadRequestException("Student and Parent are already linked");
        }

        StudentParentMapping mapping = StudentParentMapping.builder()
                .student(student)
                .parent(parent)
                .build();

        studentParentMappingRepository.save(mapping);

        auditLogRepository.save(AuditLog.builder()
                .user(student.getUser())
                .userEmail(student.getUser().getEmail())
                .action("ADMIN_LINK_PARENT_STUDENT")
                .details("Linked Student " + student.getRollNumber() + " with Parent " + parent.getUser().getEmail())
                .build());
    }

    @Override
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .gender(user.getGender())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .profilePhotoType(user.getProfilePhotoType())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
