package com.hostelsync.student.repository;

import com.hostelsync.student.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    Optional<StudentProfile> findByUserId(UUID userId);

    Optional<StudentProfile> findByRollNumber(String rollNumber);

    boolean existsByRollNumber(String rollNumber);

    @Query("SELECT s FROM StudentProfile s JOIN s.user u WHERE " +
           "(:dept IS NULL OR s.department = :dept) AND " +
           "(:year IS NULL OR s.yearOfStudy = :year) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<StudentProfile> filterStudents(@Param("dept") String dept,
                                        @Param("year") String year,
                                        @Param("search") String search,
                                        Pageable pageable);

    List<StudentProfile> findByRoomId(UUID roomId);
}
