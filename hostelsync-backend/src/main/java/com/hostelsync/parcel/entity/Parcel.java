package com.hostelsync.parcel.entity;

import com.hostelsync.auth.entity.User;
import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.shared.enums.ParcelStatus;
import com.hostelsync.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "parcels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "courier_company", nullable = false)
    private String courierCompany;

    @Column(name = "tracking_number", nullable = false)
    private String trackingNumber;

    @Column(name = "parcel_type", nullable = false)
    private String parcelType;

    @Column(name = "arrival_date", nullable = false)
    @Builder.Default
    private LocalDateTime arrivalDate = LocalDateTime.now();

    @Column(name = "collected_date")
    private LocalDateTime collectedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ParcelStatus status = ParcelStatus.PENDING;

    @Column(name = "verification_qr_code", columnDefinition = "TEXT")
    private String verificationQrCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by")
    private User addedBy;
}
