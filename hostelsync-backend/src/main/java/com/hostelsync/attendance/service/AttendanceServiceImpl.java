package com.hostelsync.attendance.service;

import com.hostelsync.attendance.dto.BulkAttendanceRequest;
import com.hostelsync.attendance.dto.StudentAttendanceRecordDto;
import com.hostelsync.attendance.entity.AttendanceRecord;
import com.hostelsync.attendance.repository.AttendanceRecordRepository;
import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.parent.entity.StudentParentMapping;
import com.hostelsync.parent.repository.StudentParentMappingRepository;
import com.hostelsync.shared.enums.AttendanceSession;
import com.hostelsync.shared.enums.AttendanceStatus;
import com.hostelsync.shared.enums.NotificationType;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentParentMappingRepository studentParentMappingRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void markBulkAttendance(BulkAttendanceRequest request, String markedByEmail) {
        User warden = userRepository.findByEmail(markedByEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        for (StudentAttendanceRecordDto item : request.getRecords()) {
            StudentProfile student = studentProfileRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

            Optional<AttendanceRecord> existing = attendanceRecordRepository
                    .findByStudentIdAndAttendanceDateAndSession(student.getId(), request.getAttendanceDate(), request.getSession());

            AttendanceRecord record;
            if (existing.isPresent()) {
                record = existing.get();
                record.setStatus(item.getStatus());
                record.setReason(item.getReason());
                record.setMarkedBy(warden);
                record.setMarkedAt(LocalDateTime.now());
            } else {
                record = AttendanceRecord.builder()
                        .student(student)
                        .attendanceDate(request.getAttendanceDate())
                        .session(request.getSession())
                        .status(item.getStatus())
                        .reason(item.getReason())
                        .markedBy(warden)
                        .markedAt(LocalDateTime.now())
                        .build();
            }

            attendanceRecordRepository.save(record);

            // ABSENT AUTOMATION RULE
            if (item.getStatus() == AttendanceStatus.ABSENT) {
                // 1. Notify Student
                notificationService.createAndSendNotification(
                        student.getUser(),
                        "Absent Alert",
                        "You were marked absent for " + request.getSession() + " Attendance on " + request.getAttendanceDate() + ".",
                        NotificationType.ATTENDANCE
                );

                // 2. Notify Parent
                List<StudentParentMapping> parentMappings = studentParentMappingRepository.findByStudentId(student.getId());
                for (StudentParentMapping mapping : parentMappings) {
                    notificationService.createAndSendNotification(
                            mapping.getParent().getUser(),
                            "Absent Alert for Ward",
                            "Your ward " + student.getUser().getFullName() + " was marked absent for " + request.getSession() + " Attendance on " + request.getAttendanceDate() + ".",
                            NotificationType.ATTENDANCE
                    );
                }
            }
        }
    }

    @Override
    public List<AttendanceRecord> getStudentAttendanceHistory(UUID studentId) {
        return attendanceRecordRepository.findByStudentId(studentId);
    }

    @Override
    public List<AttendanceRecord> getSessionAttendance(LocalDate date, AttendanceSession session) {
        return attendanceRecordRepository.findByAttendanceDateAndSession(date, session);
    }
}
