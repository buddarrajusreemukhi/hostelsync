package com.hostelsync.gatepass.service;

import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.gatepass.dto.CreateGatePassRequest;
import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.gatepass.entity.GatePassReceipt;
import com.hostelsync.gatepass.repository.GatePassReceiptRepository;
import com.hostelsync.gatepass.repository.GatePassRepository;
import com.hostelsync.notification.service.NotificationService;
import com.hostelsync.shared.enums.GatePassStatus;
import com.hostelsync.shared.enums.NotificationType;
import com.hostelsync.shared.exception.BadRequestException;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.shared.util.GatePassPdfGenerator;
import com.hostelsync.shared.util.QRCodeUtil;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GatePassServiceImpl implements GatePassService {

    private final GatePassRepository gatePassRepository;
    private final GatePassReceiptRepository gatePassReceiptRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final QRCodeUtil qrCodeUtil;
    private final GatePassPdfGenerator gatePassPdfGenerator;

    @Override
    @Transactional
    public GatePass applyGatePass(CreateGatePassRequest request, String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        GatePass gatePass = GatePass.builder()
                .student(student)
                .destination(request.getDestination())
                .reason(request.getReason())
                .fromTime(request.getFromTime())
                .toTime(request.getToTime())
                .emergencyContact(request.getEmergencyContact())
                .status(GatePassStatus.PENDING)
                .build();

        return gatePassRepository.save(gatePass);
    }

    @Override
    public List<GatePass> getStudentGatePasses(String studentEmail) {
        StudentProfile student = studentProfileRepository.findByUserId(
                userRepository.findByEmail(studentEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("Student user not found")).getId()
        ).orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return gatePassRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Override
    public Page<GatePass> getPendingGatePasses(Pageable pageable) {
        return gatePassRepository.findByStatus(GatePassStatus.PENDING, pageable);
    }

    @Override
    @Transactional
    public GatePass approveGatePass(UUID gatePassId, String wardenEmail, String remarks) {
        GatePass gatePass = gatePassRepository.findById(gatePassId)
                .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        gatePass.setStatus(GatePassStatus.APPROVED);
        gatePass.setApprovedBy(warden);
        gatePass.setApprovedAt(LocalDateTime.now());
        gatePass.setRemarks(remarks);

        GatePass saved = gatePassRepository.save(gatePass);

        // Generate Receipt & QR Code
        String receiptNo = "GP-" + System.currentTimeMillis();
        String qrPayload = "HOSTELSYNC:GP:" + saved.getId() + ":" + saved.getStudent().getRollNumber();
        String qrBase64 = qrCodeUtil.generateQRCodeBase64(qrPayload, 250, 250);
        String digitalSignature = "SIGNED_BY_WARDEN_" + warden.getFullName().toUpperCase().replace(" ", "_") + "_" + System.currentTimeMillis();

        GatePassReceipt receipt = GatePassReceipt.builder()
                .gatePass(saved)
                .receiptNumber(receiptNo)
                .qrCodeData(qrBase64)
                .wardenDigitalSignature(digitalSignature)
                .generatedAt(LocalDateTime.now())
                .build();

        gatePassReceiptRepository.save(receipt);

        // Notify Student
        notificationService.createAndSendNotification(
                saved.getStudent().getUser(),
                "Gate Pass Approved",
                "Your gate pass to " + saved.getDestination() + " has been APPROVED by " + warden.getFullName() + ".",
                NotificationType.GATE_PASS
        );

        return saved;
    }

    @Override
    @Transactional
    public GatePass rejectGatePass(UUID gatePassId, String wardenEmail, String remarks) {
        GatePass gatePass = gatePassRepository.findById(gatePassId)
                .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        User warden = userRepository.findByEmail(wardenEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Warden user not found"));

        gatePass.setStatus(GatePassStatus.REJECTED);
        gatePass.setApprovedBy(warden);
        gatePass.setApprovedAt(LocalDateTime.now());
        gatePass.setRemarks(remarks);

        GatePass saved = gatePassRepository.save(gatePass);

        // Notify Student
        notificationService.createAndSendNotification(
                saved.getStudent().getUser(),
                "Gate Pass Rejected",
                "Your gate pass request was REJECTED. Reason: " + remarks,
                NotificationType.GATE_PASS
        );

        return saved;
    }

    @Override
    public ByteArrayInputStream downloadReceiptPdf(UUID gatePassId) {
        GatePass gatePass = gatePassRepository.findById(gatePassId)
                .orElseThrow(() -> new ResourceNotFoundException("Gate pass not found"));

        if (gatePass.getStatus() != GatePassStatus.APPROVED) {
            throw new BadRequestException("Receipt is only available for APPROVED gate passes");
        }

        GatePassReceipt receipt = gatePassReceiptRepository.findByGatePassId(gatePassId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not generated"));

        return gatePassPdfGenerator.generateReceiptPdf(gatePass, receipt);
    }

    @Override
    public GatePassReceipt getReceiptDetails(UUID gatePassId) {
        return gatePassReceiptRepository.findByGatePassId(gatePassId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
    }
}
