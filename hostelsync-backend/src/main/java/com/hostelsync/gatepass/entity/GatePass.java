package com.hostelsync.gatepass.entity;

import com.hostelsync.auth.entity.User;
import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.shared.enums.GatePassStatus;
import com.hostelsync.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "gate_passes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatePass extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "destination", nullable = false)
    private String destination;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "from_time", nullable = false)
    private LocalDateTime fromTime;

    @Column(name = "to_time", nullable = false)
    private LocalDateTime toTime;

    @Column(name = "emergency_contact", nullable = false)
    private String emergencyContact;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private GatePassStatus status = GatePassStatus.PENDING;

    @Column(name = "remarks")
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
