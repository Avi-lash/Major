package com.courselist.backend.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.courselist.backend.Service.TeacherServiceImp;
import com.courselist.backend.dbCLasses.TeacherEntity;
import org.springframework.web.bind.annotation.CrossOrigin.*;
@RestController
@RequestMapping("/teacher")
@CrossOrigin(origins = "http://localhost:5173/",allowCredentials="true")
public class TeacherController {

    @Autowired
    private TeacherServiceImp teacherService;

    @PostMapping("/register")
    public String createTeacher(@RequestBody TeacherEntity teacher) {
        return teacherService.createTeacher(teacher);
    }

    @PostMapping("/login")
    public Map<String, Object> loginTeacher(@RequestBody Map<String,Object> request) {
        System.out.println(request);
         return teacherService.loginTeacher(request);
        
    }

    @PostMapping("/send-otp")
    public Map<String, Object> sendOtp(@RequestParam String email) {
        return teacherService.sendOtp(email);
    }

    @PostMapping("/update-password")
    public String updatePassword(@RequestParam String email, @RequestParam String password) {
        return teacherService.updatePassword(email, password);
    }

    @GetMapping("/{id}")
    public Map<String, String> getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @PutMapping("/update/{id}")
    public TeacherEntity updateTeacher(@PathVariable Long id, @RequestBody TeacherEntity teacher) {
        return teacherService.updateTeacher(id, teacher);
    }

    // DTO class for login
    public static class LoginRequest {
        public String email;
        public String password;
    }
}
