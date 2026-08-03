package com.hostelsync.complaint.service;

import com.hostelsync.complaint.dto.CreateComplaintRequest;
import com.hostelsync.complaint.dto.UpdateComplaintRequest;
import com.hostelsync.complaint.entity.Complaint;
import com.hostelsync.shared.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ComplaintService {

    Complaint raiseComplaint(CreateComplaintRequest request, MultipartFile photo, String studentEmail);

    List<Complaint> getStudentComplaints(String studentEmail);

    Page<Complaint> getComplaintsByStatus(ComplaintStatus status, Pageable pageable);

    Complaint updateComplaintStatus(UUID complaintId, UpdateComplaintRequest request, String wardenEmail);

    Complaint rateResolution(UUID complaintId, int rating, String studentEmail);
}
