package com.hostelsync.visitor.repository;

import com.hostelsync.visitor.entity.Visitor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, UUID> {

    List<Visitor> findByStudentIdOrderByEntryTimeDesc(UUID studentId);

    Page<Visitor> findAllByOrderByEntryTimeDesc(Pageable pageable);
}
