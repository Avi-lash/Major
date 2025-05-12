package com.courselist.backend.Controller;

import com.courselist.backend.Service.CourseService;
import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.dbCLasses.CourseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.Base64;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:5173") // Update if frontend runs on different port
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addCourse(
            @RequestParam String courseName,
            @RequestParam String description,
            @RequestParam Double fees,
            @RequestParam String duration,
            @RequestParam String teacherName,
            @RequestParam MultipartFile image
    ) {
        try {
            CourseEntity course = new CourseEntity();
            course.setCourseName(courseName);
            course.setDescription(description);
            course.setFees(fees);
            course.setDuration(duration);
            course.setTeacherName(teacherName);
            course.setImageData(image.getBytes());

            String result = courseService.addCourse(course);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add course");
        }
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> dtos = courseService.getAllCourses().stream()
                .map(CourseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCourseById(@PathVariable Long id) {
        try {
            Optional<CourseEntity> course = courseService.findById(id);
            if (course.isPresent()) {
                CourseEntity c = course.get();
                Map<String, Object> data = new HashMap<>();
                data.put("courseId", c.getCourseId());
                data.put("courseName", c.getCourseName());
                data.put("description", c.getDescription());
                data.put("fees", c.getFees());
                data.put("duration", c.getDuration());
                data.put("teacherName", c.getTeacherName());
                data.put("imageBase64", Base64.getEncoder().encodeToString(c.getImageData()));
                return ResponseEntity.ok(data);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "Course not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
