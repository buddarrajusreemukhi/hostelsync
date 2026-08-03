package com.hostelsync.attendance.service;

import com.hostelsync.attendance.dto.BulkAttendanceRequest;
import com.hostelsync.attendance.entity.AttendanceRecord;
import com.hostelsync.shared.enums.AttendanceSession;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceService {

    void markBulkAttendance(BulkAttendanceRequest request, String markedByEmail);

    List<AttendanceRecord> getStudentAttendanceHistory(UUID studentId);

    List<AttendanceRecord> getSessionAttendance(LocalDate date, AttendanceSession session);
}
