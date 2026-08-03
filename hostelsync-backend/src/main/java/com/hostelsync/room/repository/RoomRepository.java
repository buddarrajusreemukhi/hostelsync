package com.hostelsync.room.repository;

import com.hostelsync.room.entity.Room;
import com.hostelsync.shared.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {

    List<Room> findByFloorId(UUID floorId);

    List<Room> findByStatus(RoomStatus status);

    long countByStatus(RoomStatus status);
}
