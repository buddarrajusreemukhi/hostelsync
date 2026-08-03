package com.hostelsync.parcel.service;

import com.hostelsync.parcel.dto.AddParcelRequest;
import com.hostelsync.parcel.entity.Parcel;
import com.hostelsync.shared.enums.ParcelStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParcelService {

    Parcel addParcel(AddParcelRequest request, String wardenEmail);

    List<Parcel> getStudentParcels(String studentEmail);

    Page<Parcel> getParcelsByStatus(ParcelStatus status, Pageable pageable);

    Parcel markAsCollected(UUID parcelId);
}
