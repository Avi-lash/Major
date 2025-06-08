package com.courselist.backend.dbCLasses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "purchased_payments")
public class PurchasedPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = false)
    private Long courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"purchasedPayments"}) // Avoid infinite loop
    private StudentEntity student;

    @Column(nullable = false)
    private String teacherName;

    @Column(nullable = false)
    private Double amount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date paymentDate;

    public PurchasedPayment() {}

    public PurchasedPayment(Long courseId, StudentEntity student, String teacherName, Double amount, Date paymentDate) {
        this.courseId = courseId;
        this.student = student;
        this.teacherName = teacherName;
        this.amount = amount;
        this.paymentDate = paymentDate;
    }

    // Getters and setters
    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public StudentEntity getStudent() {
        return student;
    }

    public void setStudent(StudentEntity student) {
        this.student = student;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }
}
