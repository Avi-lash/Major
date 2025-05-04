package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courselist.backend.dbCLasses.StudentEntity;

public interface StudentRepository extends JpaRepository<StudentEntity, Long>{
    
    boolean existsByEmail(String email);
    StudentEntity findByEmail(String email);

}

