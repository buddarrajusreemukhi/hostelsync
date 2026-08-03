package com.hostelsync.parent.repository;

import com.hostelsync.parent.entity.StudentParentMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentParentMappingRepository extends JpaRepository<StudentParentMapping, UUID> {

    List<StudentParentMapping> findByParentId(UUID parentId);

    List<StudentParentMapping> findByStudentId(UUID studentId);

    Optional<StudentParentMapping> findByStudentIdAndParentId(UUID studentId, UUID parentId);

    boolean existsByStudentIdAndParentId(UUID studentId, UUID parentId);
}
