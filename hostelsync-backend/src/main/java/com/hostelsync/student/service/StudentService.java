package com.hostelsync.student.service;

import com.hostelsync.student.dto.StudentDashboardDto;

public interface StudentService {

    StudentDashboardDto getStudentDashboard(String studentEmail);
}
