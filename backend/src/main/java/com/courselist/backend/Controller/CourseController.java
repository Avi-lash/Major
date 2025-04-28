package com.courselist.backend.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.courselist.backend.Service.CourseService;
import com.courselist.backend.dbCLasses.Courses;
import com.courselist.backend.repository.CourseRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequestMapping("/course")
@RestController
@CrossOrigin(origins="http://localhost:5173", allowCredentials = "true")
public class CourseController {
    @Autowired
    CourseService cs;
    @Autowired
    CourseRepository cr;
    @PostMapping("/add")
    public ResponseEntity<String> AddCourse(@RequestBody Courses course) {
        //TODO: process POST request
        try {
            String response=cs.addCourse(course);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // TODO: handle exception
            return ResponseEntity.status(500).body("Error");
        }
  
    }
    @GetMapping("/getcourse")
    public ResponseEntity<List<Map<String,Object>>> ShowCourse() {
        List<Courses> courses=cr.findAll();
        List<Map<String, Object>> courseList = new ArrayList<>();
         for (Courses course : courses) {
        Map<String, Object> courseMap = new HashMap<>();
        courseMap.put("id", course.getId());
        courseMap.put("courseName", course.getCourseName());
        courseMap.put("courseFees", course.getCourseFees());
        courseMap.put("timeRequired", course.getTimeRequired());
        courseMap.put("teacherName", course.getTeacherName());
        courseMap.put("rating", course.getRating());

        courseList.add(courseMap);
    }
    return ResponseEntity.ok(courseList);

    }
    
}

