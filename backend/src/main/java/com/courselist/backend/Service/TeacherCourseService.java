package com.courselist.backend.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Base64;
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
    // TeacherCourseService.java
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

        // Convert image byte[] to Base64 string
        byte[] imageData = (byte[]) row[6];
        if (imageData != null) {
            String base64Image = Base64.getEncoder().encodeToString(imageData);
            courseMap.put("image", base64Image);
        } else {
            courseMap.put("image", null);
        }

        courseList.add(courseMap);
    }

    return courseList;
}

    public byte[] getImageByCourseId(Long courseId) {
        CourseEntity course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return course.getImage();
    }
}
