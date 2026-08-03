package com.hostelsync.student.controller;

import com.hostelsync.shared.dto.ApiResponse;
import com.hostelsync.student.dto.StudentDashboardDto;
import com.hostelsync.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Module", description = "Student Dashboard & Personal Hostel Activities")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Authenticated Student Dashboard Overview")
    public ResponseEntity<ApiResponse<StudentDashboardDto>> getDashboard(Authentication authentication) {
        StudentDashboardDto response = studentService.getStudentDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student dashboard fetched", response));
    }
}
