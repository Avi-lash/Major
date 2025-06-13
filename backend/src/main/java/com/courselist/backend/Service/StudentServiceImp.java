package com.courselist.backend.Service;
import java.util.HashMap;
import java.util.List;
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
import com.courselist.backend.repository.TeacherRepository;


@Service
public class StudentServiceImp {

      @Autowired
    private TeacherRepository teacherRepository;
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
         if (teacherRepository.existsByEmail(student.getEmail()) ) {
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

     public StudentEntity getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

     public StudentEntity updateStudent(Long id, StudentEntity updatedStudentData) {
        Optional<StudentEntity> existingStudentOptional = studentRepository.findById(id);

        if (existingStudentOptional.isPresent()) {
            StudentEntity existingStudent = existingStudentOptional.get();

            // Update only the fields that are allowed to be changed
            existingStudent.setName(updatedStudentData.getName());
            existingStudent.setEmail(updatedStudentData.getEmail()); // Assuming email is updatable
            existingStudent.setPhnno(updatedStudentData.getPhnno()); // Assuming your StudentEntity has a getPhoneNumber/setPhoneNumber method

            // IMPORTANT: Do NOT update password here unless it's explicitly part of a password reset flow
            // If StudentEntity has other fields you want to allow updating, add them here:
            // existingStudent.setAddress(updatedStudentData.getAddress());
            // existingStudent.setGrade(updatedStudentData.getGrade());


            return studentRepository.save(existingStudent); // Save and return the updated entity
        } else {
            return null; // Return null if student not found, controller should handle 404
        }
    }

    // Method to delete a student
    public String deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return "Student deleted successfully";
        } else {
            return "Student not found";
        }
    }

     public List<StudentEntity> getAllStudents() {
        return (List<StudentEntity>) studentRepository.findAll(); // findAll returns Iterable, cast to List
    }
}
