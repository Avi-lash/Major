package com.courselist.backend.dbCLasses;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "teacher_info")
public class TeacherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Keep this simple and consistent

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phnno;

    private String password;

     @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("teacher-to-courses")

    private List<CourseEntity> courses;

    // Constructors
    public TeacherEntity() {}

    public TeacherEntity(Long id, String name, String email, String phnno, String password, List<CourseEntity> courses) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phnno = phnno;
        this.password = password;
        this.courses = courses;
    }

    // Getters and setters (standard naming)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhnno() { return phnno; }
    public void setPhnno(String phnno) { this.phnno = phnno; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<CourseEntity> getCourses() { return courses; }
    public void setCourses(List<CourseEntity> courses) { this.courses = courses; }
}
