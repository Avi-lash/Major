package com.courselist.backend.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    @PostMapping("/create")
    public ResponseEntity <String> createStudent(@RequestBody StudentEntity student) {
        //TODO: process POST request
        System.out.println(student);
       try {
        String res= studentService.createStudent(student);
        if (res.equals("Email already registered")) {
            return ResponseEntity.status(400).body(res);
        }
        return ResponseEntity.ok(res);
           
       } catch (Exception e) {
        return ResponseEntity.status(500).body("Error registering teacher: " + e.getMessage());
       } 
    }
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginStudent(@RequestBody LoginRequest request) {
        try {
            String result = studentService.loginStudent(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Login error: " + e.getMessage());
        }
    }
    @PostMapping("/forgot-password")    
    public ResponseEntity<Map<String,Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            Map <String , Object> result = studentService.sendOtp(email);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map <String , Object> errres=new HashMap<>();
            errres.put("status","error");
            errres.put("message",e);
            return ResponseEntity.status(500).body(errres);
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
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("message", "Error verifying OTP: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    
 }
 @PutMapping("/update-password")
public ResponseEntity<String> updatePassword(@RequestBody Map<String,Object> entity) {
    //TODO: process PUT request
    try {
        String email=(String)entity.get("email");
    String password=(String)entity.get("password");
    String response;
        response = studentService.updatePassword(email, password);
    return ResponseEntity.ok(response);
    } catch (Exception e) {
        // TODO: handle exception
        return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
    }

}
}