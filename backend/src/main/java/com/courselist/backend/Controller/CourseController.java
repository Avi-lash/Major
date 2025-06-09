package com.courselist.backend.Controller;

import com.courselist.backend.Service.CourseService;
import com.courselist.backend.Service.VideoService; // Import VideoService
import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.dbCLasses.CourseDTO;
import com.courselist.backend.dbCLasses.Video; // Import Video entity
import com.courselist.backend.playload.CustomMessage; // Assuming you have this DTO for error messages

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.Base64;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/courses") // Changed to /api/v1/courses to match frontend calls
@CrossOrigin(origins = "http://localhost:5173") // Update if frontend runs on different port
public class CourseController {

    private final CourseService courseService; // Changed to constructor injection
    private final VideoService videoService;   // Changed to constructor injection

    @Autowired // Removed @Autowired from fields, added to constructor for best practice
    public CourseController(CourseService courseService, VideoService videoService) {
        this.courseService = courseService;
        this.videoService = videoService;
    }

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

    // NEW ENDPOINT: Get video information for a specific course ID
    // This will be accessible at: /api/v1/courses/{courseId}/video
    @GetMapping("/{courseId}/video")
    public ResponseEntity<?> getVideoForCourse(@PathVariable Long courseId) {
        Optional<CourseEntity> courseOptional = courseService.findById(courseId);

        if (courseOptional.isEmpty()) {
            // Using CustomMessage DTO for consistent error responses
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CustomMessage.builder().message("Course not found").success(false).build());
        }

        // Logic to retrieve the main video for this course.
        // This assumes you want the "first" video found for the course.
        // If a course can have many videos and you need a specific "primary" one,
        // you might need a way to mark it in your DB or select based on creation time, etc.
        List<Video> videosInCourse = videoService.findVideosByCourseId(courseId);

        if (videosInCourse.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CustomMessage.builder().message("No video found for this course").success(false).build());
        }

        Video video = videosInCourse.get(0); // For simplicity, return the first video found

        // Create a DTO to return only the necessary video info to the frontend
        // This inner class is okay for a simple DTO, or you can create a separate file.
        class VideoInfoDto {
            public String videoId;
            public String title;
            public String description;

            public VideoInfoDto(String videoId, String title, String description) {
                this.videoId = videoId;
                this.title = title;
                this.description = description;
            }
        }

        return ResponseEntity.ok(new VideoInfoDto(video.getVideoId(), video.getTitle(), video.getDescription()));
    }
}