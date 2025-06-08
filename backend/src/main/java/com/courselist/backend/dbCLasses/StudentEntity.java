package com.courselist.backend.dbCLasses;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "student_info")
public class StudentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phnno;

    private String password;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore // Prevent infinite recursion during JSON serialization
    private List<PurchasedPayment> purchasedPayments;

    // No-args constructor
    public StudentEntity() {
    }

    // All-args constructor
    public StudentEntity(Long id, String name, String email, String phnno, String password, List<PurchasedPayment> purchasedPayments) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phnno = phnno;
        this.password = password;
        this.purchasedPayments = purchasedPayments;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhnno() {
        return phnno;
    }

    public void setPhnno(String phnno) {
        this.phnno = phnno;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<PurchasedPayment> getPurchasedPayments() {
        return purchasedPayments;
    }

    public void setPurchasedPayments(List<PurchasedPayment> purchasedPayments) {
        this.purchasedPayments = purchasedPayments;
    }

    // toString() method excluding purchasedPayments to avoid recursion
    @Override
    public String toString() {
        return "StudentEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phnno='" + phnno + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
