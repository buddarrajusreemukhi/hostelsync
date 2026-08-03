package com.hostelsync.gatepass.service;

import com.hostelsync.gatepass.dto.CreateGatePassRequest;
import com.hostelsync.gatepass.entity.GatePass;
import com.hostelsync.gatepass.entity.GatePassReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.UUID;

public interface GatePassService {

    GatePass applyGatePass(CreateGatePassRequest request, String studentEmail);

    List<GatePass> getStudentGatePasses(String studentEmail);

    Page<GatePass> getPendingGatePasses(Pageable pageable);

    GatePass approveGatePass(UUID gatePassId, String wardenEmail, String remarks);

    GatePass rejectGatePass(UUID gatePassId, String wardenEmail, String remarks);

    ByteArrayInputStream downloadReceiptPdf(UUID gatePassId);

    GatePassReceipt getReceiptDetails(UUID gatePassId);
}
