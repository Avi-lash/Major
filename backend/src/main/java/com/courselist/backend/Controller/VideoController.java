package com.courselist.backend.Controller;

import com.courselist.backend.dbCLasses.Video;
import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.playload.CustomMessage;
import com.courselist.backend.Service.VideoService;
import com.courselist.backend.Service.CourseService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/videos")
@CrossOrigin(origins = "http://localhost:5173")
public class VideoController {

    private final VideoService videoService;
    private final CourseService courseService;

    public VideoController(VideoService videoService, CourseService courseService) {
        this.videoService = videoService;
        this.courseService = courseService;
    }

    // Upload video with optional assignment PDF and course_id
    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "assignment", required = false) MultipartFile assignment,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("course_id") Long courseId
    ) {
        Optional<CourseEntity> courseOptional = courseService.findById(courseId);

        if (courseOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CustomMessage.builder()
                            .message("Invalid course ID")
                            .success(false)
                            .build());
        }

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setVideoId(UUID.randomUUID().toString());
        video.setCourse(courseOptional.get());

        Video savedVideo = videoService.save(video, file, assignment);

        if (savedVideo != null) {
            return ResponseEntity.ok(savedVideo);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomMessage.builder().message("Upload failed").success(false).build());
        }
    }

    // Get all videos
    @GetMapping
    public List<Video> getAll() {
        return videoService.getAll();
    }

    // Get video info by ID
    @GetMapping("/{videoId}")
    public ResponseEntity<Video> getVideoById(@PathVariable String videoId) {
        Video video = videoService.get(videoId);
        if (video == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(video);
    }

    // Stream video file
    @GetMapping("/stream/{videoId}")
    public ResponseEntity<Resource> stream(@PathVariable String videoId) {
        Video video = videoService.get(videoId);

        if (video == null || video.getFilePath() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        File file = new File(video.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        String contentType = video.getContentType() != null ? video.getContentType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // Stream assignment file
    @GetMapping("/assignment/{videoId}")
    public ResponseEntity<Resource> streamAssignment(@PathVariable String videoId) {
        Video video = videoService.get(videoId);

        if (video == null || video.getAssignmentPath() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        File file = new File(video.getAssignmentPath());
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        String contentType = video.getAssignmentContentType() != null
                ? video.getAssignmentContentType()
                : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // Download assignment
    @GetMapping("/download-assignment/{videoId}")
    public ResponseEntity<Resource> downloadAssignment(@PathVariable String videoId) {
        Video video = videoService.get(videoId);

        if (video == null || video.getAssignmentPath() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        File file = new File(video.getAssignmentPath());
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        String contentType = video.getAssignmentContentType() != null
                ? video.getAssignmentContentType()
                : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}
