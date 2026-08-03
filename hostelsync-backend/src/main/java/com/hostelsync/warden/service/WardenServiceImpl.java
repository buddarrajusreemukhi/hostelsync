package com.hostelsync.warden.service;

import com.hostelsync.attendance.repository.AttendanceRecordRepository;
import com.hostelsync.complaint.repository.ComplaintRepository;
import com.hostelsync.gatepass.repository.GatePassRepository;
import com.hostelsync.laundry.repository.LaundryRequestRepository;
import com.hostelsync.parcel.repository.ParcelRepository;
import com.hostelsync.room.repository.RoomRepository;
import com.hostelsync.shared.enums.*;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import com.hostelsync.warden.dto.WardenDashboardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class WardenServiceImpl implements WardenService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final GatePassRepository gatePassRepository;
    private final ComplaintRepository complaintRepository;
    private final LaundryRequestRepository laundryRequestRepository;
    private final ParcelRepository parcelRepository;
    private final RoomRepository roomRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    public WardenDashboardDto getDashboardStats() {
        LocalDate today = LocalDate.now();
        long present = attendanceRecordRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT);
        long absent = attendanceRecordRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.ABSENT);
        long leave = attendanceRecordRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.LEAVE);

        long pendingGatePasses = gatePassRepository.countByStatus(GatePassStatus.PENDING);
        long pendingComplaints = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long pendingLaundry = laundryRequestRepository.countByStatus(LaundryStatus.PENDING);
        long pendingParcels = parcelRepository.countByStatus(ParcelStatus.PENDING);

        int occupiedRooms = (int) roomRepository.findAll().stream().filter(r -> r.getCurrentOccupancy() > 0).count();
        int availableRooms = (int) roomRepository.countByStatus(RoomStatus.AVAILABLE);

        return WardenDashboardDto.builder()
                .todayPresent(present)
                .todayAbsent(absent)
                .todayLeave(leave)
                .pendingGatePasses(pendingGatePasses)
                .pendingComplaints(pendingComplaints)
                .pendingLaundry(pendingLaundry)
                .pendingParcels(pendingParcels)
                .occupiedRooms(occupiedRooms)
                .availableRooms(availableRooms)
                .build();
    }

    @Override
    public Page<StudentProfile> getStudents(String dept, String year, String search, Pageable pageable) {
        return studentProfileRepository.filterStudents(dept, year, search, pageable);
    }
}
