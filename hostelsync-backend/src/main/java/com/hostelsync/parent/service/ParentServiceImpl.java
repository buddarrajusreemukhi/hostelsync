package com.hostelsync.parent.service;

import com.hostelsync.attendance.repository.AttendanceRecordRepository;
import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.complaint.repository.ComplaintRepository;
import com.hostelsync.gatepass.repository.GatePassRepository;
import com.hostelsync.laundry.repository.LaundryRequestRepository;
import com.hostelsync.parcel.repository.ParcelRepository;
import com.hostelsync.parent.dto.ParentDashboardDto;
import com.hostelsync.parent.entity.ParentProfile;
import com.hostelsync.parent.entity.StudentParentMapping;
import com.hostelsync.parent.repository.ParentProfileRepository;
import com.hostelsync.parent.repository.StudentParentMappingRepository;
import com.hostelsync.shared.enums.AttendanceStatus;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.entity.StudentProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final UserRepository userRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final StudentParentMappingRepository studentParentMappingRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final GatePassRepository gatePassRepository;
    private final ComplaintRepository complaintRepository;
    private final LaundryRequestRepository laundryRequestRepository;
    private final ParcelRepository parcelRepository;

    @Override
    public ParentDashboardDto getParentDashboard(String parentEmail) {
        User parentUser = userRepository.findByEmail(parentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Parent user not found"));

        ParentProfile parent = parentProfileRepository.findByUserId(parentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found"));

        List<StudentParentMapping> mappings = studentParentMappingRepository.findByParentId(parent.getId());
        if (mappings.isEmpty()) {
            return ParentDashboardDto.builder()
                    .childUser(null)
                    .childRollNumber("Not Linked")
                    .childDepartment("N/A")
                    .childRoomNumber("N/A")
                    .childAttendancePercentage(0.0)
                    .build();
        }

        StudentProfile child = mappings.get(0).getStudent();
        User childUser = child.getUser();

        long presentCount = attendanceRecordRepository.countByStudentIdAndStatus(child.getId(), AttendanceStatus.PRESENT);
        long totalCount = attendanceRecordRepository.totalCountByStudentId(child.getId());
        double attendancePercentage = totalCount > 0 ? (double) presentCount / totalCount * 100 : 100.0;

        String roomNumber = child.getRoom() != null ? child.getRoom().getRoomNumber() : "Unassigned";

        return ParentDashboardDto.builder()
                .childUser(mapToUserDto(childUser))
                .childRollNumber(child.getRollNumber())
                .childDepartment(child.getDepartment())
                .childRoomNumber(roomNumber)
                .childAttendancePercentage(Math.round(attendancePercentage * 10.0) / 10.0)
                .recentAttendance(attendanceRecordRepository.findByStudentId(child.getId()))
                .recentGatePasses(gatePassRepository.findByStudentIdOrderByCreatedAtDesc(child.getId()))
                .recentComplaints(complaintRepository.findByStudentIdOrderByCreatedAtDesc(child.getId()))
                .recentLaundry(laundryRequestRepository.findByStudentIdOrderByCreatedAtDesc(child.getId()))
                .recentParcels(parcelRepository.findByStudentIdOrderByArrivalDateDesc(child.getId()))
                .build();
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
