package com.courselist.backend.repository;

import com.courselist.backend.dbCLasses.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import List for the new method's return type
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository <Video,String> {

    Optional<Video> findByTitle(String title);

    // New Derived Query Method: Find all videos by the associated Course ID
    // Spring Data JPA will automatically generate the SQL query for this.
    List<Video> findByCourseCourseId(Long courseId); // <--- THIS IS THE ADDITION

    //query meths

    //native

    //criteria api
}