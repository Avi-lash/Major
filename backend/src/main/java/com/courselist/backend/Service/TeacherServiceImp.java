package com.courselist.backend.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.courselist.backend.Controller.TeacherController;
import com.courselist.backend.config.JwtUtil;
import com.courselist.backend.dbCLasses.TeacherEntity;
import com.courselist.backend.repository.TeacherRepository;

@Service
public class TeacherServiceImp {
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private EmailService emailservice;
    @Autowired
    private JwtUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String createTeacher(TeacherEntity teacher) {
        if (teacherRepository.existsByEmail(teacher.getEmail())) {
            return "Email already registered";
        }

        // Hash the password
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        teacherRepository.save(teacher);
        emailservice.sendEmail(teacher.getEmail(), "Registration Successful", "your account...");
        return "Saved Successfully";
    }

    public Map<String, Object> loginTeacher(TeacherController.LoginRequest request) {
        String email = request.email;
        String password = request.password;
    
        Optional<TeacherEntity> optionalTeacher = teacherRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();
    
        if (optionalTeacher.isEmpty() || !passwordEncoder.matches(password, optionalTeacher.get().getPassword())) {
            response.put("status", "error");
            response.put("message", "Invalid email or password");
            return response;
        }

        TeacherEntity teacher = optionalTeacher.get();
        response.put("status", "success");
        response.put("message", "Login successful");
        response.put("teacherId", teacher.getId());
        response.put("teacherName", teacher.getName());
        response.put("email", teacher.getEmail());
    
        return response;
    }
    
    public Map<String, Object> sendOtp(String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<TeacherEntity> existingTeacherOpt = teacherRepository.findByEmail(email);
            if (existingTeacherOpt.isPresent()) {
                String otp = generateOtp();
                emailservice.sendEmail(email, "Password Recovery", "Your otp is: " + otp);
                String token = jwtUtil.generateOtpToken(email, otp, 360);
                response.put("status", "success");
                response.put("token", token);
                response.put("message", "Otp sent successfully");
            } else {
                response.put("status", "failed");
                response.put("message", "Email not found");
            }
        } catch (Exception e) {
            response.put("status", "failed");
            response.put("message", "Error occured: " + e.getMessage());
        }
        return response;
    }

    public Map<String, String> getTeacherById(Long id) {
        Optional<TeacherEntity> optionalTeacher = teacherRepository.findById(id);
        Map<String, String> response = new HashMap<>();

        if (optionalTeacher.isPresent()) {
            TeacherEntity teacher = optionalTeacher.get();
            response.put("name", teacher.getName());
            response.put("email", teacher.getEmail());
            response.put("phnno", teacher.getPhnno());
        } else {
            response.put("error", "Teacher not found");
        }

        return response;
    }

    private String generateOtp() {
        int otpValue = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(otpValue);
    }

    public String updatePassword(String email, String password) {
        try {
            Optional<TeacherEntity> existingTeacherOpt = teacherRepository.findByEmail(email);
            if (existingTeacherOpt.isPresent()) {
                TeacherEntity existingTeacher = existingTeacherOpt.get();
                String hashpassword = passwordEncoder.encode(password);
                existingTeacher.setPassword(hashpassword);
                teacherRepository.save(existingTeacher);
                return "password updated successfully";
            } else {
                return "password update failed!!!";
            }
        } catch (Exception e) {
            return "error= " + e.getMessage();
        }
    }

    // New method to update teacher profile info
    public TeacherEntity updateTeacher(Long id, TeacherEntity updatedTeacher) {
        Optional<TeacherEntity> optionalTeacher = teacherRepository.findById(id);
        if (!optionalTeacher.isPresent()) {
            throw new RuntimeException("Teacher not found");
        }
        TeacherEntity existingTeacher = optionalTeacher.get();
        existingTeacher.setName(updatedTeacher.getName());
        existingTeacher.setEmail(updatedTeacher.getEmail());
        existingTeacher.setPhnno(updatedTeacher.getPhnno());
        return teacherRepository.save(existingTeacher);
    }
}
