package com.courselist.backend.dbCLasses;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="Courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Courses {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "course_name", nullable = false)
    // @JsonProperty("Course_Name") used when name is different just in case
    private String courseName;

    @Column(name = "course_fees", nullable = false)
    private String courseFees;

    @Column(name = "time_required", nullable = false)
    private String timeRequired;

    @Column(name = "teacher_name", nullable = false)
    private String teacherName;

    @Column(name = "rating")
    private String rating;

    @Column(name = "created_at", insertable = false, updatable = false)
    private String createdAt; // You can use java.sql.Timestamp if you want real date-time
}
    

