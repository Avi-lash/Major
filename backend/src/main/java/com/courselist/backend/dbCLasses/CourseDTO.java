package com.courselist.backend.dbCLasses;

import java.util.Base64;

import lombok.Data;
@Data
public class CourseDTO {
    private Long courseId;
    private String courseName;
    private String description;
    private Double fees;
    private String duration;
    private String teacherName;
    private String imageBase64;

    public CourseDTO(CourseEntity entity) {
        this.courseId = entity.getCourseId();
        this.courseName = entity.getCourseName();
        this.description = entity.getDescription();
        this.fees = entity.getFees();
        this.duration = entity.getDuration();
        this.teacherName = entity.getTeacherName();
        this.imageBase64 = Base64.getEncoder().encodeToString(entity.getImageData());
    }


}
