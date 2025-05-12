package com.courselist.backend.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

import com.courselist.backend.config.JwtUtil;


import ch.qos.logback.core.joran.util.beans.BeanUtil;





import com.courselist.backend.Controller.StudentController;
import com.courselist.backend.dbCLasses.StudentEntity;
import com.courselist.backend.dbCLasses.TeacherEntity;
import com.courselist.backend.repository.StudentRepository;


@Service
public class StudentServiceImp {

     @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private EmailService emailservice;
    @Autowired
    private JwtUtil jwtUtil;
    
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();




    public String createStudent(StudentEntity student) {
      
        if (studentRepository.existsByEmail(student.getEmail())) {
            return "Email already registered";
        }

        // Hash the password
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        studentRepository.save(student);
        emailservice.sendEmail(student.getEmail(), "Registration Successful", "your account...");
        return "Saved Successfully";




    }

    public Map<String, Object> loginStudent(StudentController.LoginRequest request) {
        String email = request.email;
        String password = request.password;
    
        StudentEntity student = studentRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();
    
        if (student == null || !passwordEncoder.matches(password, student.getPassword())) {
            response.put("status", "error");
            response.put("message", "Invalid email or password");
            return response;
        }
    
        response.put("status", "success");
        response.put("message", "Login successful");
        response.put("studentId", student.getId());
        response.put("studentName", student.getName());
        response.put("email", student.getEmail());
    
        return response;
    }
    

    public Map<String, Object> sendOtp(String email) {
        
        StudentEntity existingStudent= studentRepository.findByEmail(email);
       Map <String,Object> response= new HashMap<>();
       
       try {
         if (existingStudent != null){
          String otp=generateOtp();
          emailservice.sendEmail(email, "Password Recovery", "Your otp is: "+otp);
          String token=jwtUtil.generateOtpToken(email, otp, 360);
          response.put("status", "success");
          response.put("token",token);
          response.put("message","Otp sent successfully");
          
         }

        
    } catch(Exception e)
    {
        response.put("status", "failed");
        response.put("message", "Error occured" +e);
       
    }
    return response;
   
    }
    private String generateOtp() {
        int otpValue = (int)(Math.random() * 900000) + 100000;
        return String.valueOf(otpValue);
    }

    public String updatePassword(String email, String password) {
        // TODO Auto-generated method stub
        
        StudentEntity existingStudent= studentRepository.findByEmail(email);
   try{ if ( existingStudent != null)
    {
        String hashpassword=passwordEncoder.encode(password);
        existingStudent.setPassword(hashpassword);
        studentRepository.save(existingStudent);
        return "password updated successfully";
    }
    else
    {
        return "password update failed!!!";
    }
}
 catch (Exception e){
 return "error= " + e;
}
    }
    
}
