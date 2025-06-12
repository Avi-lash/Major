package com.courselist.backend.Controller;

import com.courselist.backend.Service.CourseService;
import com.courselist.backend.Service.VideoService;
import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.dbCLasses.CourseDTO;
import com.courselist.backend.dbCLasses.Video;
import com.courselist.backend.playload.CustomMessage;

import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;
    private final VideoService videoService;

    @Autowired
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
                Map<String, Object> error = new HashMap<>();
                error.put("status", "error");
                error.put("message", "Course not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{courseId}/video")
    public ResponseEntity<?> getVideoForCourse(@PathVariable Long courseId) {
        Optional<CourseEntity> courseOptional = courseService.findById(courseId);

        if (courseOptional.isEmpty()) {
            CustomMessage msg = new CustomMessage();
            msg.setMessage("Course not found");
            msg.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }

        List<Video> videosInCourse = videoService.findVideosByCourseId(courseId);

        if (videosInCourse.isEmpty()) {
            CustomMessage msg = new CustomMessage();
            msg.setMessage("No video found for this course");
            msg.setSuccess(false);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }

        Video video = videosInCourse.get(0);

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

    @PutMapping("/update/{id}")
    public ResponseEntity<CourseEntity> updateCourse(
            @PathVariable Long id,
            @RequestParam("courseName") String courseName,
            @RequestParam("description") String description,
            @RequestParam("fees") Double fees,
            @RequestParam("duration") String duration,
            @RequestParam("teacherName") String teacherName,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            CourseEntity existingCourse = courseService.getCourseById(id);
            if (existingCourse == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            existingCourse.setCourseName(courseName);
            existingCourse.setDescription(description);
            existingCourse.setFees(fees);
            existingCourse.setDuration(duration);
            existingCourse.setTeacherName(teacherName);

            if (image != null && !image.isEmpty()) {
                existingCourse.setImageData(image.getBytes());
            }

            CourseEntity updatedCourse = courseService.updateCourse(id, existingCourse);
            return ResponseEntity.ok(updatedCourse);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        try {
            String result = courseService.deleteCourse(id);
            if (result.equals("Course deleted successfully")) {
                return ResponseEntity.ok(result);
            } else if (result.equals("Course not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting course: " + e.getMessage());
        }
    }
}
