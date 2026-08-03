package com.hostelsync.gatepass.repository;

import com.hostelsync.gatepass.entity.GatePassReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GatePassReceiptRepository extends JpaRepository<GatePassReceipt, UUID> {

    Optional<GatePassReceipt> findByGatePassId(UUID gatePassId);

    Optional<GatePassReceipt> findByReceiptNumber(String receiptNumber);
}
