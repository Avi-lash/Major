package com.courselist.backend.dbCLasses;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "teacher_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Long id;  // ✅ Renamed from teacherId to id

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phnno;

    private String password;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<CourseEntity> courses;
}
