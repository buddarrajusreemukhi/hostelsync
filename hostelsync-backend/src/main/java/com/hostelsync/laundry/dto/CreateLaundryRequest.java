package com.hostelsync.laundry.dto;

import com.hostelsync.shared.enums.WashType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateLaundryRequest {

    @Min(value = 1, message = "Clothes count must be at least 1")
    private int clothesCount;

    @NotNull(message = "Wash type is required")
    private WashType washType;

    @NotNull(message = "Pickup date is required")
    private LocalDate pickupDate;

    private String specialInstructions;
}
