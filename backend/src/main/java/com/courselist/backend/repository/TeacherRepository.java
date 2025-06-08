package com.courselist.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.courselist.backend.dbCLasses.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    boolean existsByEmail(String email);
    Optional<TeacherEntity> findByEmail(String email);
}
