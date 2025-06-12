// package: com.courselist.backend.dto

package com.courselist.backend.dbCLasses;

public class EnrolledStudentDTO {
    private String name;
    private String email;
    private String enrolledDate;

    public EnrolledStudentDTO(String name, String email, String enrolledDate) {
        this.name = name;
        this.email = email;
        this.enrolledDate = enrolledDate;
    }

    // Getters and setters
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

    public String getEnrolledDate() {
        return enrolledDate;
    }
    public void setEnrolledDate(String enrolledDate) {
        this.enrolledDate = enrolledDate;
    }
}
