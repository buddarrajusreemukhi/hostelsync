package com.hostelsync.auth.service;

import com.hostelsync.auth.dto.*;
import com.hostelsync.auth.entity.RefreshToken;
import com.hostelsync.auth.entity.User;
import com.hostelsync.auth.repository.RefreshTokenRepository;
import com.hostelsync.auth.repository.UserRepository;
import com.hostelsync.parent.entity.ParentProfile;
import com.hostelsync.parent.repository.ParentProfileRepository;
import com.hostelsync.shared.enums.ProfilePhotoType;
import com.hostelsync.shared.enums.Role;
import com.hostelsync.shared.enums.UserStatus;
import com.hostelsync.shared.exception.BadRequestException;
import com.hostelsync.shared.exception.ResourceNotFoundException;
import com.hostelsync.shared.exception.UnauthorizedException;
import com.hostelsync.shared.security.JwtTokenProvider;
import com.hostelsync.shared.util.CloudinaryService;
import com.hostelsync.shared.util.DefaultAvatarService;
import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.student.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ParentProfileRepository parentProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final DefaultAvatarService defaultAvatarService;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid Credentials"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        if (user.getStatus() == UserStatus.PENDING_APPROVAL) {
            throw new UnauthorizedException("Your account is awaiting Admin approval.");
        }

        if (user.getStatus() == UserStatus.REJECTED || user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Account Disabled");
        }

        String accessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        // Create or update RefreshToken
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(7 * 24 * 60 * 60))
                .build();
        refreshTokenRepository.save(refreshToken);

        UserDto userDto = mapToUserDto(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .user(userDto)
                .build();
    }

    @Override
    @Transactional
    public UserDto registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered");
        }
        if (studentProfileRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("Roll number is already registered");
        }

        String avatarUrl = defaultAvatarService.getDefaultAvatar(request.getGender());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.STUDENT)
                .status(UserStatus.PENDING_APPROVAL)
                .gender(request.getGender())
                .profilePhotoUrl(avatarUrl)
                .profilePhotoType(ProfilePhotoType.DEFAULT)
                .build();

        User savedUser = userRepository.save(user);

        StudentProfile studentProfile = StudentProfile.builder()
                .user(savedUser)
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .yearOfStudy(request.getYearOfStudy())
                .section(request.getSection())
                .bloodGroup(request.getBloodGroup())
                .dateOfBirth(request.getDateOfBirth())
                .build();

        studentProfileRepository.save(studentProfile);

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto registerParent(ParentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered");
        }

        String avatarUrl = defaultAvatarService.getDefaultAvatar(request.getGender());

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(Role.PARENT)
                .status(UserStatus.PENDING_APPROVAL)
                .gender(request.getGender())
                .profilePhotoUrl(avatarUrl)
                .profilePhotoType(ProfilePhotoType.DEFAULT)
                .build();

        User savedUser = userRepository.save(user);

        ParentProfile parentProfile = ParentProfile.builder()
                .user(savedUser)
                .occupation(request.getOccupation())
                .address(request.getAddress())
                .build();

        parentProfileRepository.save(parentProfile);

        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token has expired");
        }

        User user = token.getUser();
        String newAccessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email"));
        // Email reset logic simulated / dispatched
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Reset password logic
    }

    @Override
    @Transactional
    public UserDto uploadProfilePhoto(String userEmail, MultipartFile file) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String uploadedUrl = cloudinaryService.uploadFile(file, "profiles");
        user.setProfilePhotoUrl(uploadedUrl);
        user.setProfilePhotoType(ProfilePhotoType.CUSTOM);

        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto deleteProfilePhoto(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String defaultUrl = defaultAvatarService.getDefaultAvatar(user.getGender());
        user.setProfilePhotoUrl(defaultUrl);
        user.setProfilePhotoType(ProfilePhotoType.DEFAULT);

        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }

    @Override
    public UserDto getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .gender(user.getGender())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .profilePhotoType(user.getProfilePhotoType())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
