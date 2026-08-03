package com.hostelsync.parcel.service;

import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.parcel.dto.AddParcelRequest;
import com.hostelsync.parcel.entity.Parcel;
import com.hostelsync.parcel.repository.ParcelRepository;
import com.hostelsync.parent.entity.StudentParentMapping;
import com.hostelsync.parent.repository.StudentParentMappingRepository;
import com.hostelsync.shared.enums.NotificationType;
import com.hostelsync.shared.enums.ParcelStatus;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.shared.util.QRCodeUtil;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParcelServiceImpl implements ParcelService {

    private final ParcelRepository parcelRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentParentMappingRepository studentParentMappingRepository;
    private final NotificationService notificationService;
    private final QRCodeUtil qrCodeUtil;

    @Override
    @Transactional
    public Parcel addParcel(AddParcelRequest request, String wardenEmail) {
        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        StudentProfile student = studentProfileRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        String qrData = qrCodeUtil.generateQRCodeBase64("PARCEL:" + request.getTrackingNumber() + ":" + student.getRollNumber(), 200, 200);

        Parcel parcel = Parcel.builder()
                .student(student)
                .courierCompany(request.getCourierCompany())
                .trackingNumber(request.getTrackingNumber())
                .parcelType(request.getParcelType())
                .arrivalDate(LocalDateTime.now())
                .status(ParcelStatus.READY_FOR_COLLECTION)
                .verificationQrCode(qrData)
                .addedBy(warden)
                .build();

        Parcel saved = parcelRepository.save(parcel);

        // Notify Student
        notificationService.createAndSendNotification(
                student.getUser(),
                "Parcel Arrival Alert",
                "Your parcel from " + request.getCourierCompany() + " (Tracking: " + request.getTrackingNumber() + ") has arrived at the Warden office.",
                NotificationType.PARCEL
        );

        // Notify Parent
        List<StudentParentMapping> parentMappings = studentParentMappingRepository.findByStudentId(student.getId());
        for (StudentParentMapping mapping : parentMappings) {
            notificationService.createAndSendNotification(
                    mapping.getParent().getUser(),
                    "Ward Parcel Alert",
                    "A parcel for your ward " + student.getUser().getFullName() + " has arrived at the hostel.",
                    NotificationType.PARCEL
            );
        }

        return saved;
    }

    @Override
    public List<Parcel> getStudentParcels(String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return parcelRepository.findByStudentIdOrderByArrivalDateDesc(student.getId());
    }

    @Override
    public Page<Parcel> getParcelsByStatus(ParcelStatus status, Pageable pageable) {
        if (status != null) {
            return parcelRepository.findByStatus(status, pageable);
        }
        return parcelRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public Parcel markAsCollected(UUID parcelId) {
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel not found"));

        parcel.setStatus(ParcelStatus.COLLECTED);
        parcel.setCollectedDate(LocalDateTime.now());

        return parcelRepository.save(parcel);
    }
}
