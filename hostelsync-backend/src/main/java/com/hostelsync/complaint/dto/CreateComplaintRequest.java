package com.hostelsync.complaint.dto;

import com.hostelsync.shared.enums.ComplaintCategory;
import com.hostelsync.shared.enums.ComplaintPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateComplaintRequest {

    @NotNull(message = "Category is required")
    private ComplaintCategory category;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private ComplaintPriority priority;
}
