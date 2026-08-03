package com.hostelsync.gatepass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateGatePassRequest {

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Reason is required")
    private String reason;

    @NotNull(message = "From time is required")
    private LocalDateTime fromTime;

    @NotNull(message = "To time is required")
    private LocalDateTime toTime;

    @NotBlank(message = "Emergency contact is required")
    private String emergencyContact;
}
