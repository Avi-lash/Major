package com.courselist.backend.Service;


import com.courselist.backend.dbCLasses.CourseEntity;
import com.courselist.backend.dbCLasses.TeacherEntity;
import com.courselist.backend.repository.CourseRepository;
import com.courselist.backend.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeacherCourseService {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private TeacherRepository teacherRepo;

    public CourseEntity addCourse(CourseEntity course, Long teacherId) {
        TeacherEntity teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        course.setTeacher(teacher);
        return courseRepo.save(course);
    }
}
