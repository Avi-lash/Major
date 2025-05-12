package com.courselist.backend.Service;

import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    CourseRepository cr;

    public String addCourse(CourseEntity course) {
        try {
            cr.save(course);
            return "Course Registered";
        } catch (Exception e) {
            return "Not registered";
        }
    }

    public List<CourseEntity> getAllCourses() {
        return cr.findAll();
    }

    // Add this method to fix the error
    public Optional<CourseEntity> findById(Long id) {
        return cr.findById(id);
    }
}