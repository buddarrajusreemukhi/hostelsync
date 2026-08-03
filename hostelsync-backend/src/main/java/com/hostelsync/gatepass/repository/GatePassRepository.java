package com.hostelsync.gatepass.repository;

import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.shared.enums.GatePassStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, UUID> {

    List<GatePass> findByStudentIdOrderByCreatedAtDesc(UUID studentId);

    Page<GatePass> findByStatus(GatePassStatus status, Pageable pageable);

    long countByStatus(GatePassStatus status);
}
