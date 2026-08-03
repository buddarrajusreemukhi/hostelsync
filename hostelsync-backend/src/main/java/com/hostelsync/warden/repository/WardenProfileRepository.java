package com.hostelsync.warden.repository;

import com.hostelsync.warden.entity.WardenProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WardenProfileRepository extends JpaRepository<WardenProfile, UUID> {

    Optional<WardenProfile> findByUserId(UUID userId);

    Optional<WardenProfile> findByEmployeeId(String employeeId);

    boolean existsByEmployeeId(String employeeId);
}
