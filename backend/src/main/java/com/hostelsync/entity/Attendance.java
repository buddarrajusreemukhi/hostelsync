package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus morningStatus; // PRESENT, ABSENT, LATE

    @Enumerated(EnumType.STRING)
    private AttendanceStatus afternoonStatus;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus eveningStatus;

    private String remarks;

    private LocalDateTime markedAt;

    public enum AttendanceStatus {
        PRESENT, ABSENT, LATE, NOT_MARKED
    }
}
