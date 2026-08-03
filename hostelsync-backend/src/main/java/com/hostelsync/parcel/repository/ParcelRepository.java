package com.hostelsync.parcel.repository;

import com.hostelsync.parcel.entity.Parcel;
import com.hostelsync.shared.enums.ParcelStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, UUID> {

    List<Parcel> findByStudentIdOrderByArrivalDateDesc(UUID studentId);

    Page<Parcel> findByStatus(ParcelStatus status, Pageable pageable);

    long countByStatus(ParcelStatus status);
}
