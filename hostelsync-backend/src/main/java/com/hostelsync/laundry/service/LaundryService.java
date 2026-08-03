package com.hostelsync.laundry.service;

import com.hostelsync.laundry.dto.CreateLaundryRequest;
import com.hostelsync.laundry.entity.LaundryRequest;
import com.hostelsync.shared.enums.LaundryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface LaundryService {

    LaundryRequest submitLaundryRequest(CreateLaundryRequest request, String studentEmail);

    List<LaundryRequest> getStudentLaundryRequests(String studentEmail);

    Page<LaundryRequest> getLaundryRequestsByStatus(LaundryStatus status, Pageable pageable);

    LaundryRequest updateLaundryStatus(UUID requestId, LaundryStatus status);
}
