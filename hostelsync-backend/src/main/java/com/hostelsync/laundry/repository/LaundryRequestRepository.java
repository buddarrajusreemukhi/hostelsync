package com.hostelsync.laundry.repository;

import com.hostelsync.laundry.entity.LaundryRequest;
import com.hostelsync.shared.enums.LaundryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LaundryRequestRepository extends JpaRepository<LaundryRequest, UUID> {

    List<LaundryRequest> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

    Page<LaundryRequest> findByStatus(LaundryStatus status, Pageable pageable);

    long countByStatus(LaundryStatus status);
}
