package com.courselist.backend.repository;

import com.courselist.backend.dbCLasses.PurchasedPayment;
import com.courselist.backend.dbCLasses.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchasedPaymentRepository extends JpaRepository<PurchasedPayment, Long> {
    List<PurchasedPayment> findByStudent(StudentEntity student);

    // ✅ NEW: Find all payments for a given course ID
    List<PurchasedPayment> findByCourseId(Long courseId);
}
