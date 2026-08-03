package com.hostelsync.laundry.service;

import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.laundry.dto.CreateLaundryRequest;
import com.hostelsync.laundry.entity.LaundryRequest;
import com.hostelsync.laundry.repository.LaundryRequestRepository;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.shared.enums.LaundryStatus;
import com.hostelsync.shared.enums.NotificationType;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LaundryServiceImpl implements LaundryService {

    private final LaundryRequestRepository laundryRequestRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public LaundryRequest submitLaundryRequest(CreateLaundryRequest request, String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        LaundryRequest laundryRequest = LaundryRequest.builder()
                .student(student)
                .clothesCount(request.getClothesCount())
                .washType(request.getWashType())
                .pickupDate(request.getPickupDate())
                .specialInstructions(request.getSpecialInstructions())
                .status(LaundryStatus.PENDING)
                .build();

        return laundryRequestRepository.save(laundryRequest);
    }

    @Override
    public List<LaundryRequest> getStudentLaundryRequests(String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return laundryRequestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Override
    public Page<LaundryRequest> getLaundryRequestsByStatus(LaundryStatus status, Pageable pageable) {
        if (status != null) {
            return laundryRequestRepository.findByStatus(status, pageable);
        }
        return laundryRequestRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public LaundryRequest updateLaundryStatus(UUID requestId, LaundryStatus status) {
        LaundryRequest request = laundryRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Laundry request not found"));

        request.setStatus(status);
        LaundryRequest saved = laundryRequestRepository.save(request);

        // Notify Student
        notificationService.createAndSendNotification(
                saved.getStudent().getUser(),
                "Laundry Status Update",
                "Your laundry request status has been updated to: " + status.name(),
                NotificationType.LAUNDRY
        );

        return saved;
    }
}
