package com.hostelsync.student.service;

import com.hostelsync.attendance.repository.AttendanceRecordRepository;
import com.hostelsync.auth.dto.UserDto;
import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.complaint.repository.ComplaintRepository;
import com.hostelsync.gatepass.repository.GatePassRepository;
import com.hostelsync.laundry.repository.LaundryRequestRepository;
import com.hostelsync.parcel.repository.ParcelRepository;
import com.hostelsync.shared.enums.AttendanceStatus;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.dto.StudentDashboardDto;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final GatePassRepository gatePassRepository;
    private final LaundryRequestRepository laundryRequestRepository;
    private final ParcelRepository parcelRepository;
    private final ComplaintRepository complaintRepository;

    @Override
    public StudentDashboardDto getStudentDashboard(String studentEmail) {
        User user = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        long presentCount = attendanceRecordRepository.countByStudentIdAndStatus(student.getId(), AttendanceStatus.PRESENT);
        long totalCount = attendanceRecordRepository.totalCountByStudentId(student.getId());
        double attendancePercentage = totalCount > 0 ? (double) presentCount / totalCount * 100 : 100.0;

        List<UserDto> roommates = new ArrayList<>();
        String roomNumber = "Unassigned";
        String blockName = "Unassigned";

        if (student.getRoom() != null) {
            roomNumber = student.getRoom().getRoomNumber();
            if (student.getRoom().getFloor() != null && student.getRoom().getFloor().getBlock() != null) {
                blockName = student.getRoom().getFloor().getBlock().getName();
            }

            roommates = studentProfileRepository.findByRoomId(student.getRoom().getId()).stream()
                    .filter(s -> !s.getId().equals(student.getId()))
                    .map(s -> mapToUserDto(s.getUser()))
                    .collect(Collectors.toList());
        }

        UserDto studentDto = mapToUserDto(user);

        return StudentDashboardDto.builder()
                .student(studentDto)
                .rollNumber(student.getRollNumber())
                .department(student.getDepartment())
                .yearOfStudy(student.getYearOfStudy())
                .roomNumber(roomNumber)
                .blockName(blockName)
                .roommates(roommates)
                .attendancePercentage(Math.round(attendancePercentage * 10.0) / 10.0)
                .todayAttendanceStatus("MARKED_PRESENT")
                .recentGatePasses(gatePassRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()))
                .recentLaundry(laundryRequestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()))
                .recentParcels(parcelRepository.findByStudentIdOrderByArrivalDateDesc(student.getId()))
                .recentComplaints(complaintRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()))
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
