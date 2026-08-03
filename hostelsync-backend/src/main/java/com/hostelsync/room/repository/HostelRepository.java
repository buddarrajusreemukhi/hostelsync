package com.hostelsync.room.repository;

import com.hostelsync.room.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, UUID> {

    Optional<Hostel> findByCode(String code);

    boolean existsByCode(String code);
}
