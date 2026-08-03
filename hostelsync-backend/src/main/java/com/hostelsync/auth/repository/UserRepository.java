package com.hostelsync.auth.repository;

import com.hostelsync.auth.entity.User;
import com.hostelsync.shared.enums.Role;
import com.hostelsync.shared.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByStatus(UserStatus status, Pageable pageable);

    Page<User> findByRoleAndStatus(Role role, UserStatus status, Pageable pageable);

    List<User> findByRole(Role role);

    long countByStatus(UserStatus status);

    long countByRole(Role role);
}
