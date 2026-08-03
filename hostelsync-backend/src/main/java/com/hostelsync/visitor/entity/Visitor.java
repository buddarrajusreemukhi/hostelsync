package com.hostelsync.visitor.entity;

import com.hostelsync.auth.entity.User;
import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(name = "relation", nullable = false)
    private String relation;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "id_proof_url")
    private String idProofUrl;

    @Column(name = "photo_url")
    private String photoUrl;
}
