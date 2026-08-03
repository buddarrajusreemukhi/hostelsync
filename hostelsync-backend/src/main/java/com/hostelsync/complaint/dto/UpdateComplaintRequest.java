package com.hostelsync.complaint.dto;

import com.hostelsync.shared.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateComplaintRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    private String remarks;
}
