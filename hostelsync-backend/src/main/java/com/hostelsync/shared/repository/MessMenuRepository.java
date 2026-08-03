package com.hostelsync.shared.repository;

import com.hostelsync.shared.entity.MessMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, UUID> {

    Optional<MessMenu> findByDayOfWeekIgnoreCase(String dayOfWeek);
}
