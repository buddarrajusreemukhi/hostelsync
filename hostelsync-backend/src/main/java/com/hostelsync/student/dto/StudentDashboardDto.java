package com.hostelsync.student.dto;

import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.complaint.entity.Complaint;
import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.laundry.entity.LaundryRequest;
import com.hostelsync.parcel.entity.Parcel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardDto {

    private UserDto student;
    private String rollNumber;
    private String department;
    private String yearOfStudy;
    private String roomNumber;
    private String blockName;
    private List<UserDto> roommates;

    private double attendancePercentage;
    private String todayAttendanceStatus;

    private List<GatePass> recentGatePasses;
    private List<LaundryRequest> recentLaundry;
    private List<Parcel> recentParcels;
    private List<Complaint> recentComplaints;
}
