package com.courselist.backend.Service;
import com.courselist.backend.dbCLasses.Courses;
import com.courselist.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class CourseService {
    @Autowired
    CourseRepository cr;

    public String addCourse(Courses course) {
        try {
            cr.save(course);
            return "Course Registered";
        } catch (Exception e) {
            return "Not registered";
            // TODO: handle exception
        }
        // TODO Auto-generated method stub
        
    }
        
}
