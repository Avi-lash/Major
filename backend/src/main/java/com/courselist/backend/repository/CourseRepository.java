package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.courselist.backend.dbCLasses.CourseEntity;
import java.util.List;


public interface CourseRepository extends JpaRepository<CourseEntity, Long>{
    // Courses findById(int id);
    // Courses findByCourseName(String courseName);
    @Query(value = "SELECT c.course_id, c.course_name, c.description, c.fees, c.duration, c.teacher_name , c.image_data " +
                   "FROM course_info c WHERE c.tid = :teacherId", nativeQuery = true)
    List<Object[]> findCourseDetailsByTeacherId(@Param("teacherId") Long teacherId);
//     List<CourseEntity> findByTeacherId(Long teacherId);
}

