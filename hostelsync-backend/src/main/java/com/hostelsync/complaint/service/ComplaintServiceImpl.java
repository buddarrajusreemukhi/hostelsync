package com.hostelsync.complaint.service;

import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.complaint.dto.CreateComplaintRequest;
import com.hostelsync.complaint.dto.UpdateComplaintRequest;
import com.hostelsync.complaint.entity.Complaint;
import com.hostelsync.complaint.entity.ComplaintUpdate;
import com.hostelsync.complaint.repository.ComplaintRepository;
import com.hostelsync.complaint.repository.ComplaintUpdateRepository;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.parent.entity.StudentParentMapping;
import com.hostelsync.parent.repository.StudentParentMappingRepository;
import com.hostelsync.shared.enums.ComplaintStatus;
import com.hostelsync.shared.enums.NotificationType;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.shared.util.CloudinaryService;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintUpdateRepository complaintUpdateRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentParentMappingRepository studentParentMappingRepository;
    private final NotificationService notificationService;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public Complaint raiseComplaint(CreateComplaintRequest request, MultipartFile photo, String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = cloudinaryService.uploadFile(photo, "complaints");
        }

        Complaint complaint = Complaint.builder()
                .student(student)
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .photoUrl(photoUrl)
                .status(ComplaintStatus.SUBMITTED)
                .build();

        return complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getStudentComplaints(String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Override
    public Page<Complaint> getComplaintsByStatus(ComplaintStatus status, Pageable pageable) {
        if (status != null) {
            return complaintRepository.findByStatus(status, pageable);
        }
        return complaintRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public Complaint updateComplaintStatus(UUID complaintId, UpdateComplaintRequest request, String wardenEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        complaint.setStatus(request.getStatus());
        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            complaint.setResolvedBy(warden);
            complaint.setResolvedAt(LocalDateTime.now());
        }

        Complaint saved = complaintRepository.save(complaint);

        // Record Update Timeline
        ComplaintUpdate update = ComplaintUpdate.builder()
                .complaint(saved)
                .updatedBy(warden)
                .status(request.getStatus())
                .remarks(request.getRemarks())
                .build();
        complaintUpdateRepository.save(update);

        // Notify Student
        notificationService.createAndSendNotification(
                saved.getStudent().getUser(),
                "Complaint Status Update",
                "Your complaint '" + saved.getTitle() + "' is now: " + request.getStatus().name(),
                NotificationType.COMPLAINT
        );

        // Notify Parent if Resolved
        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            List<StudentParentMapping> parentMappings = studentParentMappingRepository.findByStudentId(saved.getStudent().getId());
            for (StudentParentMapping mapping : parentMappings) {
                notificationService.createAndSendNotification(
                        mapping.getParent().getUser(),
                        "Ward Complaint Resolved",
                        "The complaint raised by your ward (" + saved.getTitle() + ") has been RESOLVED.",
                        NotificationType.COMPLAINT
                );
            }
        }

        return saved;
    }

    @Override
    @Transactional
    public Complaint rateResolution(UUID complaintId, int rating, String studentEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setRating(rating);
        return complaintRepository.save(complaint);
    }
}
