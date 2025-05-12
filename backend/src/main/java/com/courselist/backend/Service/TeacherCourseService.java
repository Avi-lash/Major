package com.courselist.backend.Service;
import java.util.List;


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
    public List<CourseEntity> getCoursesByTeacher(Long teacherId) {
        return courseRepo.findByTeacherId(teacherId);
    }

    public byte[] getImageByCourseId(Long courseId) {
        CourseEntity course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getImage();
    }
}
