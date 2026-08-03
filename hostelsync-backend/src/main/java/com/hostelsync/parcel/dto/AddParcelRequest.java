package com.hostelsync.parcel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AddParcelRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotBlank(message = "Courier company is required")
    private String courierCompany;

    @NotBlank(message = "Tracking number is required")
    private String trackingNumber;

    @NotBlank(message = "Parcel type is required")
    private String parcelType;
}
