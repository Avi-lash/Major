package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.courselist.backend.dbCLasses.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    boolean existsByEmail(String email);
    TeacherEntity findByEmail(String email);
}
