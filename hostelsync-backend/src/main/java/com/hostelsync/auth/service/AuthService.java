package com.hostelsync.auth.service;

import com.hostelsync.auth.dto.*;
import com.hostelsync.auth.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    UserDto registerStudent(StudentRegisterRequest request);

    UserDto registerParent(ParentRegisterRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    UserDto uploadProfilePhoto(String userEmail, MultipartFile file);

    UserDto deleteProfilePhoto(String userEmail);

    UserDto getProfile(String userEmail);
}
