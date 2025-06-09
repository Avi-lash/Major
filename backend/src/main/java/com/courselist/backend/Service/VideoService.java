package com.courselist.backend.Service;

import com.courselist.backend.dbCLasses.Video;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional; // Added this import, as Optional might be used in other service methods if you add them later.

public interface VideoService {

    // Save video with optional assignment
    Video save(Video video, MultipartFile file, MultipartFile assignment);

    // Get video by ID
    Video get(String videoId);

    // Get video by title (Optional, can be removed if not used)
    Video getByTitle(String title);

    // Get all videos
    List<Video> getAll();

    // NEW: Get videos associated with a specific course ID
    List<Video> findVideosByCourseId(Long courseId); // <--- THIS IS THE CRUCIAL ADDITION
}