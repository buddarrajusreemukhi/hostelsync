package com.hostelsync.laundry.entity;

import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.shared.enums.LaundryStatus;
import com.hostelsync.shared.enums.WashType;
import com.hostelsync.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "laundry_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LaundryRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "clothes_count", nullable = false)
    private int clothesCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "wash_type", nullable = false)
    private WashType washType;

    @Column(name = "pickup_date", nullable = false)
    private LocalDate pickupDate;

    @Column(name = "special_instructions")
    private String specialInstructions;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private LaundryStatus status = LaundryStatus.PENDING;
}
