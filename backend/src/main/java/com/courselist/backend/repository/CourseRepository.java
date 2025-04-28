package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.courselist.backend.dbCLasses.Courses;
import java.util.List;


public interface CourseRepository extends JpaRepository<Courses,Integer>{
    Courses findById(int id);
    Courses findByCourseName(String courseName);
}

