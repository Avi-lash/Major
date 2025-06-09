package com.courselist.backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

 @GetMapping("/all") // This maps to http://localhost:8080/teacher/all
    public ResponseEntity<List<TeacherEntity>> getAllTeachers() {
         System.out.println("DEBUG: TeacherController - getAllTeachers method called."); // <-- ADD THIS  
        try {
            List<TeacherEntity> teachers = teacherService.getAllTeachers(); // Assume a new method in service
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{id}")
    public Map<String, String> getTeacherById(@PathVariable Long id) {
            System.out.println("DEBUG: TeacherController - getTeacherById method called for ID: " + id); // <-- ADD THIS
        return teacherService.getTeacherById(id);
    }



    @PutMapping("/update/{id}")
    public TeacherEntity updateTeacher(@PathVariable Long id, @RequestBody TeacherEntity teacher) {
        return teacherService.updateTeacher(id, teacher);
    }

     @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long id) {
        try {
            String result = teacherService.deleteTeacher(id); // Assuming you'll have a deleteTeacher method in your service
            if (result.equals("Teacher deleted successfully")) { // Check for success message
                return ResponseEntity.ok(result);
            } else if (result.equals("Teacher not found")) { // Check for not found message
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result); // Generic error
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting teacher: " + e.getMessage());
        }
    }

    // DTO class for login
    public static class LoginRequest {
        public String email;
        public String password;
    }
}
