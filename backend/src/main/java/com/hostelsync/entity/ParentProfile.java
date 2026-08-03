package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "parent_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String childRollNumber;

    private String occupation;

    private String relationship; // Father / Mother / Guardian

    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connected_student_id")
    private StudentProfile connectedStudent;
}
