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

       public CourseEntity getCourseById(Long id) {
        System.out.println("DEBUG: CourseServiceImp - getCourseById called for ID: " + id);
        Optional<CourseEntity> courseOptional = cr.findById(id);
        return courseOptional.orElse(null); // Returns CourseEntity if found, otherwise null
    }

     public CourseEntity updateCourse(Long id, CourseEntity updatedCourseData) {
        Optional<CourseEntity> existingCourseOptional = cr.findById(id);

        if (existingCourseOptional.isPresent()) {
            CourseEntity existingCourse = existingCourseOptional.get();

            // Update fields from updatedCourseData to existingCourse
            existingCourse.setCourseName(updatedCourseData.getCourseName());
            existingCourse.setDescription(updatedCourseData.getDescription());
            existingCourse.setFees(updatedCourseData.getFees());
             existingCourse.setDuration(updatedCourseData.getDuration());
            //existingCourse.setTeacherName(updatedCourseData.getTeacherName()); // Consider how you want to handle Teacher updates

            return cr.save(existingCourse); // Save and return the updated entity
        } else {
            return null; // Or throw a specific exception if the course is not found
        }
    }

    // NEW METHOD: deleteCourse
    public String deleteCourse(Long id) {
        if (cr.existsById(id)) {
            cr.deleteById(id);
            return "Course deleted successfully";
        } else {
            return "Course not found";
        }
    }

    
}