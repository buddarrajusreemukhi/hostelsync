package com.hostelsync.parent.repository;

import com.hostelsync.parent.entity.ParentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentProfileRepository extends JpaRepository<ParentProfile, UUID> {

    Optional<ParentProfile> findByUserId(UUID userId);
}
