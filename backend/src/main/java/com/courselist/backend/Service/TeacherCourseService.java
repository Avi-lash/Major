package com.courselist.backend.Service;

import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.dbCLasses.TeacherEntity;
import com.courselist.backend.repository.CourseRepository;
import com.courselist.backend.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeacherCourseService {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private TeacherRepository teacherRepo;

    // Add a new course and assign it to the teacher
    public CourseEntity addCourse(CourseEntity course, Long teacherId) {
        TeacherEntity teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        course.setTeacher(teacher);
        return courseRepo.save(course);
    }

    // Get all courses by a teacher in a simplified/custom format for frontend use
    public List<Map<String, Object>> getCustomCoursesByTeacher(Long teacherId) {
        List<Object[]> rawData = courseRepo.findCourseDetailsByTeacherId(teacherId);
        List<Map<String, Object>> courseList = new ArrayList<>();

        for (Object[] row : rawData) {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("courseId", row[0]);
            courseMap.put("courseName", row[1]);
            courseMap.put("description", row[2]);
            courseMap.put("fees", row[3]);
            courseMap.put("duration", row[4]);
            courseMap.put("teacherName", row[5]);

            byte[] imageData = (byte[]) row[6];
            courseMap.put("image", imageData != null ? Base64.getEncoder().encodeToString(imageData) : null);

            courseList.add(courseMap);
        }

        return courseList;
    }

    // Get image bytes of a specific course (for separate API/image delivery)
    public byte[] getImageByCourseId(Long courseId) {
        CourseEntity course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        return course.getImageData();
    }

    // Optional fallback: full course entity list (if frontend does not use custom JSON)
    public List<CourseEntity> getCoursesByTeacher(Long teacherId) {
        return courseRepo.findByTeacher_Id(teacherId);
    }
}
