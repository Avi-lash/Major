package com.courselist.backend.Service.impl;

import com.courselist.backend.dbCLasses.Video;
import com.courselist.backend.repository.VideoRepository;
import com.courselist.backend.Service.VideoService; // Ensure this import is correct

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${files.video}")
    private String DIR;

    private final VideoRepository videoRepository;

    public VideoServiceImpl(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @PostConstruct
    public void init() {
        File directory = new File(DIR);
        if (!directory.exists()) {
            directory.mkdirs();
            System.out.println("📁 Folder created at: " + DIR);
        } else {
            System.out.println("✅ Upload folder already exists at: " + DIR);
        }
    }

    @Override
    public Video save(Video video, MultipartFile videoFile, MultipartFile assignmentFile) {
        try {
            // Save video file
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoFileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(videoFile.getOriginalFilename());
                Path videoPath = Paths.get(DIR, videoFileName);
                Files.copy(videoFile.getInputStream(), videoPath, StandardCopyOption.REPLACE_EXISTING);

                video.setFilePath(videoPath.toString());
                video.setContentType(videoFile.getContentType());
            }

            // Save assignment file (PDF)
            if (assignmentFile != null && !assignmentFile.isEmpty()) {
                String assignmentFileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(assignmentFile.getOriginalFilename());
                Path assignmentPath = Paths.get(DIR, assignmentFileName);
                Files.copy(assignmentFile.getInputStream(), assignmentPath, StandardCopyOption.REPLACE_EXISTING);

                video.setAssignmentPath(assignmentPath.toString());
                video.setAssignmentContentType(assignmentFile.getContentType());
            }

            // Save video entity to database
            return videoRepository.save(video);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store files: " + e.getMessage());
        }
    }

    @Override
    public Video get(String videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found with ID: " + videoId));
    }

    @Override
    public Video getByTitle(String title) {
        // Optional: Implement if you need to search by title
        // For example: return videoRepository.findByTitle(title).orElse(null);
        // If you do this, remember to add 'findByTitle(String title)' to VideoRepository
        return null;
    }

    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }

    // --- NEW METHOD IMPLEMENTATION ---
    @Override
    public List<Video> findVideosByCourseId(Long courseId) {
        // This calls the derived query method that you need to add to your VideoRepository interface
        return videoRepository.findByCourseCourseId(courseId);
    }
}