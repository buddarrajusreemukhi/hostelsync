package com.hostelsync.parent.entity;

import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_parent_mappings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "parent_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentParentMapping extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    private ParentProfile parent;
}
