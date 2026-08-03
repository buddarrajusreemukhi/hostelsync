package com.hostelsync.student.entity;

import com.hostelsync.auth.entity.User;
import com.hostelsync.room.entity.Room;
import com.hostelsync.shared.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "year_of_study", nullable = false)
    private String yearOfStudy;

    @Column(name = "section")
    private String section;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "admission_date", nullable = false)
    @Builder.Default
    private LocalDate admissionDate = LocalDate.now();
}
