package com.hostelsync.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String complaintNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    private String category; // Electricity, Water, Cleaning, Internet, Room, Furniture, Mess, Security, Others
    private String title;
    
    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority; // LOW, MEDIUM, HIGH

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    private String attachmentUrl;
    private String resolutionNotes;
    private String resolutionImageUrl;
    private String assignedStaff;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum ComplaintStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}
