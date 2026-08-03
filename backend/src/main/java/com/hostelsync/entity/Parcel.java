package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "parcels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    private String courierCompany;
    private String trackingNumber;
    private String parcelType;
    private String remarks;

    @Enumerated(EnumType.STRING)
    private ParcelStatus status; // READY_FOR_PICKUP, COLLECTED

    private LocalDateTime receivedDate;
    private LocalDateTime collectedDate;

    public enum ParcelStatus {
        READY_FOR_PICKUP, COLLECTED
    }
}
