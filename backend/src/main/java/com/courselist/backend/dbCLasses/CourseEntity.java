package com.courselist.backend.dbCLasses;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course_info")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String courseName;
    private String description;
    private Double fees;
    private String duration;
    private String teacherName;

    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @ManyToOne
    @JoinColumn(name = "tid", nullable = false)
    private TeacherEntity teacher;

    public void setTeacher(TeacherEntity teacher) {
        this.teacher = teacher;
    }
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public void setFees(Double fees) {
        this.fees = fees;
    }
    
    public void setDuration(String duration) {
        this.duration = duration;
    }
    
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    
    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
    
    
    
    
}
