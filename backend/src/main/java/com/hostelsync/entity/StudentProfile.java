package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String rollNumber;

    private String department;

    private String course;

    private Integer year;

    private String roomNumber;

    private String hostelName;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String emergencyContact;

    private String parentEmail;

    private String parentMobile;

    private String address;

    private String photoUrl;
}
