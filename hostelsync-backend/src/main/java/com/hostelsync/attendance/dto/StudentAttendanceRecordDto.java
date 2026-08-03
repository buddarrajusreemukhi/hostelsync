package com.hostelsync.attendance.dto;

import com.hostelsync.shared.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StudentAttendanceRecordDto {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus status;

    private String reason;
}
