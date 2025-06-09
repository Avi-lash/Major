package com.courselist.backend.dbCLasses;

import jakarta.persistence.*;

@Entity
@Table(name = "yt_videos")
public class Video {

    @Id
    @Column(name = "video_id", nullable = false, unique = true)
    private String videoId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "assignment_path")
    private String assignmentPath;

    @Column(name = "assignment_content_type")
    private String assignmentContentType;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    // Constructors
    public Video() {}

    public Video(String videoId, String title, String description, String contentType, String assignmentPath, String assignmentContentType, String filePath, CourseEntity course) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.contentType = contentType;
        this.assignmentPath = assignmentPath;
        this.assignmentContentType = assignmentContentType;
        this.filePath = filePath;
        this.course = course;
    }

    // Getters and setters
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getAssignmentPath() { return assignmentPath; }
    public void setAssignmentPath(String assignmentPath) { this.assignmentPath = assignmentPath; }

    public String getAssignmentContentType() { return assignmentContentType; }
    public void setAssignmentContentType(String assignmentContentType) { this.assignmentContentType = assignmentContentType; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public CourseEntity getCourse() { return course; }
    public void setCourse(CourseEntity course) { this.course = course; }
}
