package com.hostelsync.auth.entity;

import com.hostelsync.shared.entity.BaseEntity;
import com.hostelsync.shared.enums.Gender;
import com.hostelsync.shared.enums.ProfilePhotoType;
import com.hostelsync.shared.enums.Role;
import com.hostelsync.shared.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_photo_type", nullable = false)
    @Builder.Default
    private ProfilePhotoType profilePhotoType = ProfilePhotoType.DEFAULT;
}
