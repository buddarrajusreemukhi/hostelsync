package com.hostelsync.auth.dto;

import com.hostelsync.shared.enums.Gender;
import com.hostelsync.shared.enums.ProfilePhotoType;
import com.hostelsync.shared.enums.Role;
import com.hostelsync.shared.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private UUID id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private UserStatus status;
    private Gender gender;
    private String profilePhotoUrl;
    private ProfilePhotoType profilePhotoType;
    private LocalDateTime createdAt;
}
