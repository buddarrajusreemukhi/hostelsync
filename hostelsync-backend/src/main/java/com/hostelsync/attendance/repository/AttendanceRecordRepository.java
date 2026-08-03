package com.hostelsync.attendance.repository;

import com.hostelsync.attendance.entity.AttendanceRecord;
import com.hostelsync.shared.enums.AttendanceSession;
import com.hostelsync.shared.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {

    Optional<AttendanceRecord> findByStudentIdAndAttendanceDateAndSession(UUID studentId, LocalDate attendanceDate, AttendanceSession session);

    List<AttendanceRecord> findByStudentId(UUID studentId);

    List<AttendanceRecord> findByStudentIdAndAttendanceDateBetween(UUID studentId, LocalDate startDate, LocalDate endDate);

    List<AttendanceRecord> findByAttendanceDateAndSession(LocalDate attendanceDate, AttendanceSession session);

    long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId AND a.status = :status")
    long countByStudentIdAndStatus(@Param("studentId") UUID studentId, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId")
    long totalCountByStudentId(@Param("studentId") UUID studentId);
}
