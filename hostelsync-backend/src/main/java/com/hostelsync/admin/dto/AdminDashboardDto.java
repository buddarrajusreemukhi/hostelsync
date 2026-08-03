package com.hostelsync.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {

    private long totalStudents;
    private long totalParents;
    private long totalWardens;
    private long pendingApprovals;
    private int totalCapacity;
    private int occupiedBeds;
    private int availableBeds;
    private long todayPresentCount;
    private long todayAbsentCount;
    private long pendingComplaintsCount;
    private long pendingGatePassesCount;
    private long pendingLaundryCount;
    private long pendingParcelsCount;
}
