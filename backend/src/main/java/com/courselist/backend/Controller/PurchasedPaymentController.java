package com.courselist.backend.Controller;

import com.courselist.backend.Service.PurchasedPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PurchasedPaymentController {

    @Autowired
    private PurchasedPaymentService paymentService;

    // POST endpoint to confirm and store a payment
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

    // GET endpoint to retrieve all payments by a student's ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPaymentsByUserId(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(paymentService.getPaymentsByUserId(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Error fetching purchased payments: " + e.getMessage()));
        }
    }
}
