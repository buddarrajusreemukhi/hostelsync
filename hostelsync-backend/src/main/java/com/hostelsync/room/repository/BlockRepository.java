package com.hostelsync.room.repository;

import com.hostelsync.room.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BlockRepository extends JpaRepository<Block, UUID> {

    List<Block> findByHostelId(UUID hostelId);
}
