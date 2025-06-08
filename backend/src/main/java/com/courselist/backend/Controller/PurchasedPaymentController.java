package com.courselist.backend.Controller;

import com.courselist.backend.Service.PurchasedPaymentService;
import com.courselist.backend.dbCLasses.PurchasedPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PurchasedPaymentController {

    @Autowired
    private PurchasedPaymentService paymentService;

    // ✅ Confirm and save a payment
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Long courseId = Long.valueOf(paymentData.get("courseId").toString());
            Long userId = Long.valueOf(paymentData.get("userId").toString());
            String teacherName = paymentData.get("teacherName").toString();
            Double amount = Double.valueOf(paymentData.get("amount").toString());

            paymentService.savePayment(courseId, userId, teacherName, amount);

            return ResponseEntity.ok(Map.of("message", "Payment recorded successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Failed to record payment: " + e.getMessage()));
        }
    }

    // ✅ Get all purchased payments by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPaymentsByUserId(@PathVariable Long userId) {
        try {
            List<PurchasedPayment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Error fetching purchased payments: " + e.getMessage()));
        }
    }

    // ✅ Get all students (purchases) by course ID
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getStudentsByCourseId(@PathVariable Long courseId) {
        try {
            List<PurchasedPayment> payments = paymentService.getPaymentsByCourseId(courseId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Error fetching students for course: " + e.getMessage()));
        }
    }
}
