package com.hostelsync.warden.entity;

import com.hostelsync.auth.entity.User;
import com.hostelsync.room.entity.Hostel;
import com.hostelsync.shared.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warden_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WardenProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_hostel_id")
    private Hostel assignedHostel;

    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId;
}
