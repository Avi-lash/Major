package com.courselist.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.courselist.backend.dbCLasses.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {
    boolean existsByEmail(String email);
    // @Query (value="select * from teacher_info where email=:email",nativeQuery=true)
//     List<Object[]> findByEmail(String email);
        TeacherEntity findByEmail(String email);
}
