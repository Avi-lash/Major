package com.courselist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.courselist.backend.dbCLasses.CourseEntity;

import java.util.List;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

     // Custom native query to get selected course fields + image bytes for a teacher
    @Query(value = "SELECT c.course_id, c.course_name, c.description, c.fees, c.duration, t.name AS teacher_name, c.image_data " + // Changed t.teacher_name to t.name based on TeacherEntity
                    "FROM course_info c JOIN teacher_info t ON c.teacher_id = t.id WHERE t.id = :teacherId", nativeQuery = true) // Changed c.tid = t.tid AND c.tid = :teacherId to c.teacher_id = t.id AND t.id = :teacherId
    List<Object[]> findCourseDetailsByTeacherId(@Param("teacherId") Long teacherId);

    // Corrected JPA method to get all courses by teacher's primary key (for full CourseEntity)
    List<CourseEntity> findByTeacher_Id(Long id);
}
