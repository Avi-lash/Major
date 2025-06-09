package com.courselist.backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.courselist.backend.config.JwtUtil;
import com.courselist.backend.dbCLasses.StudentEntity;
import com.courselist.backend.Service.StudentServiceImp;

@CrossOrigin(origins = "http://localhost:5173",allowCredentials="true")
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    StudentServiceImp studentService;
    @Autowired
    JwtUtil jwtUtil;

    // --- RECTIFIED THIS METHOD ---
    @PostMapping("/register") // Changed from "/create" to "/register" to match frontend
    public ResponseEntity <String> registerStudent(@RequestBody StudentEntity student) { // Renamed method for clarity
        System.out.println("Attempting to register student: " + student.getEmail()); // Improved logging
        try {
            String res= studentService.createStudent(student); // Assuming createStudent service method does the actual work
            if (res.equals("Email already registered")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res); // Use HttpStatus enum for clarity
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("Student registered successfully!"); // Return 201 Created on success
            // Note: If 'res' contains a custom message you want to send back, adjust the body.
            // For now, sending a generic success message is often clearer.
        } catch (Exception e) {
            // Log the full stack trace for better debugging in your backend console
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering student: " + e.getMessage());
        }
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginStudent(@RequestBody LoginRequest request) {
        try {
            Map<String, Object> result = studentService.loginStudent(request);
            String status = (String) result.get("status");

            if ("error".equals(status)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String,Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            Map <String , Object> result = studentService.sendOtp(email);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map <String , Object> errres=new HashMap<>();
            errres.put("status","error");
            errres.put("message",e.getMessage()); // Get string message from exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errres); // Use HttpStatus enum
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, Object> entity) {
        try {
            String userEnteredOtp = (String) entity.get("otp");
            String token = (String) entity.get("token");

            Map<String, Object> claims = jwtUtil.validateAndExtractClaims(token);
            String sessionOtp = claims.get("otp").toString();
            String email = claims.get("email").toString();

            Map<String, Object> response = new HashMap<>();
            if (sessionOtp.equals(userEnteredOtp)) {
                response.put("status", "success");
                response.put("message", "OTP verified successfully.");
                response.put("email", email);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "failure");
                response.put("message", "Invalid OTP.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Error verifying OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String,Object> entity) {
        try {
            String email=(String)entity.get("email");
            String password=(String)entity.get("password");
            String response;
            response = studentService.updatePassword(email, password);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating password: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentEntity> getStudentById(@PathVariable Long id) {
        StudentEntity student = studentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if student not found
        }
        return ResponseEntity.ok(student);
    }

      // NEW ENDPOINT: Get All Students
    @GetMapping("/all") // This maps to http://localhost:8080/student/all
    public ResponseEntity<List<StudentEntity>> getAllStudents() {
        try {
            List<StudentEntity> students = studentService.getAllStudents(); // Assume a new method in service
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


     @PutMapping("/update/{id}")
    public ResponseEntity<StudentEntity> updateStudent(@PathVariable Long id, @RequestBody StudentEntity student) {
        try {
            StudentEntity updatedStudent = studentService.updateStudent(id, student); // Assuming updateStudent in service
            if (updatedStudent == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Student not found
            }
            return ResponseEntity.ok(updatedStudent); // Return updated student entity
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Generic error
        }
    }

    // NEW ENDPOINT: Delete Student (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        try {
            String result = studentService.deleteStudent(id); // Assuming deleteStudent in service
            if (result.equals("Student deleted successfully")) {
                return ResponseEntity.ok(result);
            } else if (result.equals("Student not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting student: " + e.getMessage());
        }
    }
}