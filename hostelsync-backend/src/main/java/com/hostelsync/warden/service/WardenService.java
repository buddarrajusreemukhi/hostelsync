package com.hostelsync.warden.service;

import com.hostelsync.student.entity.StudentProfile;
import com.hostelsync.warden.dto.WardenDashboardDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WardenService {

    WardenDashboardDto getDashboardStats();

    Page<StudentProfile> getStudents(String dept, String year, String search, Pageable pageable);
}
