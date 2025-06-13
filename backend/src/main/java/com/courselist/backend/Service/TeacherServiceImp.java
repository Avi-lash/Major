package com.courselist.backend.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.courselist.backend.config.JwtUtil;
import com.courselist.backend.dbCLasses.TeacherEntity;
import com.courselist.backend.repository.StudentRepository;
import com.courselist.backend.repository.TeacherRepository;

@Service
public class TeacherServiceImp {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private EmailService emailservice;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String createTeacher(TeacherEntity teacher) {
        if (teacherRepository.existsByEmail(teacher.getEmail()) ) {
            return "Email already registered";
        }
        if(studentRepository.existsByEmail(teacher.getEmail())){
             return "Email already registered";
        }
        
        teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
        teacherRepository.save(teacher);
        emailservice.sendEmail(teacher.getEmail(), "Registration Successful", "Your account has been created.");
        return "Saved Successfully";
    }

    public Map<String, Object> loginTeacher(Map<String, Object> request) {
        String email = (String) request.get("email");
        String password = (String) request.get("password");

        TeacherEntity teacher = teacherRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (teacher == null || !passwordEncoder.matches(password, teacher.getPassword())) {
            response.put("status", "error");
            response.put("message", "Invalid email or password");
            return response;
        }

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
            TeacherEntity teacher = teacherRepository.findByEmail(email);
            if (teacher != null) {
                String otp = generateOtp();
                emailservice.sendEmail(email, "Password Recovery", "Your OTP is: " + otp);
                String token = jwtUtil.generateOtpToken(email, otp, 360);
                response.put("status", "success");
                response.put("token", token);
                response.put("message", "OTP sent successfully");
            } else {
                response.put("status", "failed");
                response.put("message", "Email not found");
            }
        } catch (Exception e) {
            response.put("status", "failed");
            response.put("message", "Error occurred: " + e.getMessage());
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
            TeacherEntity teacher = teacherRepository.findByEmail(email);
            if (teacher != null) {
                teacher.setPassword(passwordEncoder.encode(password));
                teacherRepository.save(teacher);
                return "Password updated successfully";
            } else {
                return "Password update failed";
            }
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

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

    public String deleteTeacher(Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return "Teacher deleted successfully";
        } else {
            return "Teacher not found";
        }
    }

      public List<TeacherEntity> getAllTeachers() {
        return (List<TeacherEntity>) teacherRepository.findAll(); // findAll returns Iterable, cast to List
    }
}
