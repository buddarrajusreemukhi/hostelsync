package com.hostelsync.auth.controller;

import com.hostelsync.auth.dto.*;
import com.hostelsync.auth.service.AuthService;
import com.hostelsync.shared.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Module", description = "Single Authentication & User Profile Endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Shared Login for Admin, Warden, Student, and Parent")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register/student")
    @Operation(summary = "Register Student Account (Pending Admin Approval)")
    public ResponseEntity<ApiResponse<UserDto>> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        UserDto response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Registration submitted successfully. Awaiting Admin approval.", response));
    }

    @PostMapping("/register/parent")
    @Operation(summary = "Register Parent Account (Pending Admin Approval)")
    public ResponseEntity<ApiResponse<UserDto>> registerParent(@Valid @RequestBody ParentRegisterRequest request) {
        UserDto response = authService.registerParent(request);
        return ResponseEntity.ok(ApiResponse.success("Registration submitted successfully. Awaiting Admin approval.", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh Access Token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request Password Reset Email")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset instructions dispatched to your email", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password With Token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now login.", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Authenticated User Profile")
    public ResponseEntity<ApiResponse<UserDto>> getMyProfile(Authentication authentication) {
        UserDto response = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", response));
    }

    @PostMapping("/upload-photo")
    @Operation(summary = "Upload Custom Profile Photo to Cloudinary")
    public ResponseEntity<ApiResponse<UserDto>> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        UserDto response = authService.uploadProfilePhoto(authentication.getName(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile photo updated successfully", response));
    }

    @DeleteMapping("/delete-photo")
    @Operation(summary = "Remove Custom Photo and Revert to Default Gender Avatar")
    public ResponseEntity<ApiResponse<UserDto>> deleteProfilePhoto(Authentication authentication) {
        UserDto response = authService.deleteProfilePhoto(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile photo reverted to default avatar", response));
    }
}
