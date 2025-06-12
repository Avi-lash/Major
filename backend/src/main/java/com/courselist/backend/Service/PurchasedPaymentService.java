package com.courselist.backend.Service;

import com.courselist.backend.dbCLasses.PurchasedPayment;
import com.courselist.backend.dbCLasses.StudentEntity;
import com.courselist.backend.dbCLasses.EnrolledStudentDTO;
import com.courselist.backend.repository.PurchasedPaymentRepository;
import com.courselist.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class PurchasedPaymentService {

    @Autowired
    private PurchasedPaymentRepository purchasedPaymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    public PurchasedPayment savePayment(Long courseId, Long userId, String teacherName, Double amount) {
        StudentEntity student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + userId));

        PurchasedPayment payment = new PurchasedPayment();
        payment.setCourseId(courseId);
        payment.setStudent(student);
        payment.setTeacherName(teacherName);
        payment.setAmount(amount);
        payment.setPaymentDate(new Date());

        return purchasedPaymentRepository.save(payment);
    }

    public List<PurchasedPayment> getPaymentsByUserId(Long userId) {
        StudentEntity student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + userId));
        return purchasedPaymentRepository.findByStudent(student);
    }

    // ✅ Return student details for given course ID
    public List<EnrolledStudentDTO> getStudentsByCourseId(Long courseId) {
        List<Object[]> rows = purchasedPaymentRepository.findStudentDetailsByCourseId(courseId);
        List<EnrolledStudentDTO> result = new ArrayList<>();

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");

        for (Object[] row : rows) {
            String name = (String) row[0];
            String email = (String) row[1];
            Date paymentDate = (Date) row[2];

            result.add(new EnrolledStudentDTO(name, email, formatter.format(paymentDate)));
        }

        return result;
    }
}
