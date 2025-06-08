package com.courselist.backend.dbCLasses;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "student_info")
@ToString
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
    @JsonIgnore // Prevent infinite recursion
    private List<PurchasedPayment> purchasedPayments;
}
