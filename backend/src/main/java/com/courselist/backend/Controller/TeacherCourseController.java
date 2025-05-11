package com.courselist.backend.Controller;
import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.Service.CourseService;
import com.courselist.backend.Service.TeacherCourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/courset")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TeacherCourseController {

    @Autowired
    private TeacherCourseService courseService;

    @PostMapping("/add/{teacherId}")
    public ResponseEntity<String> addCourse(
            @RequestParam("courseName") String courseName,
            @RequestParam("description") String description,
            @RequestParam("fees") Double fees,
            @RequestParam("duration") String duration,
            @RequestParam("teacherName") String teacherName,
            @RequestParam("image") MultipartFile image,
            @PathVariable Long teacherId) {
        try {
            CourseEntity course = new CourseEntity();
            course.setCourseName(courseName);
            course.setDescription(description);
            course.setFees(fees);
            course.setDuration(duration);
            course.setTeacherName(teacherName);
            course.setImageData(image.getBytes());

            courseService.addCourse(course, teacherId);
            return ResponseEntity.ok("Course added successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading image file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding course: " + e.getMessage());
        }
    }
}
