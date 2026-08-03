package com.hostelsync.attendance.dto;

import com.hostelsync.shared.enums.AttendanceSession;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BulkAttendanceRequest {

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Session is required")
    private AttendanceSession session;

    @NotEmpty(message = "Attendance records list cannot be empty")
    private List<StudentAttendanceRecordDto> records;
}
