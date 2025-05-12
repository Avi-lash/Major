package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courselist.backend.dbCLasses.CourseEntity;
import java.util.List;


public interface CourseRepository extends JpaRepository<CourseEntity, Long>{
    // Courses findById(int id);
    // Courses findByCourseName(String courseName);
    List<CourseEntity> findByTeacherId(Long teacherId);
}

