package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gate_passes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatePass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String passId; // e.g. GP-2026-8921

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    private LocalDateTime fromDateTime;
    private LocalDateTime toDateTime;
    private String reason;
    private String destination;
    private String emergencyContact;
    private Boolean parentConsent;

    @Enumerated(EnumType.STRING)
    private GatePassStatus status; // PENDING, APPROVED, REJECTED, CANCELLED

    private String qrCodeData;
    private LocalDateTime outTime;
    private LocalDateTime inTime;
    private String wardenRemarks;
    private LocalDateTime createdAt;

    public enum GatePassStatus {
        PENDING, APPROVED, REJECTED, CANCELLED, OUT, RETURNED
    }
}
