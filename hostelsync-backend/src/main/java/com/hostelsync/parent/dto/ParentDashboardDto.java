package com.hostelsync.parent.dto;

import com.hostelsync.attendance.entity.AttendanceRecord;
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
public class ParentDashboardDto {

    private UserDto childUser;
    private String childRollNumber;
    private String childDepartment;
    private String childRoomNumber;
    private double childAttendancePercentage;

    private List<AttendanceRecord> recentAttendance;
    private List<GatePass> recentGatePasses;
    private List<Complaint> recentComplaints;
    private List<LaundryRequest> recentLaundry;
    private List<Parcel> recentParcels;
}
