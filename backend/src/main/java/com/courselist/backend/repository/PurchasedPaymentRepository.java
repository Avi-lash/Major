package com.courselist.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.courselist.backend.dbCLasses.PurchasedPayment;
import com.courselist.backend.dbCLasses.StudentEntity;

@Repository
public interface PurchasedPaymentRepository extends JpaRepository<PurchasedPayment, Long> {

    List<PurchasedPayment> findByStudent(StudentEntity student);

    List<PurchasedPayment> findByCourseId(Long courseId);

    // ✅ NEW: Custom query to fetch student details (name, email, payment_date) for a course
    @Query("SELECT p.student.name, p.student.email, p.paymentDate FROM PurchasedPayment p WHERE p.courseId = :courseId")
    List<Object[]> findStudentDetailsByCourseId(Long courseId);
}
