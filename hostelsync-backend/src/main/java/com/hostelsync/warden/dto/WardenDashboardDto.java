package com.hostelsync.warden.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WardenDashboardDto {

    private long todayPresent;
    private long todayAbsent;
    private long todayLeave;
    private long pendingGatePasses;
    private long pendingComplaints;
    private long pendingLaundry;
    private long pendingParcels;
    private int occupiedRooms;
    private int availableRooms;
}
