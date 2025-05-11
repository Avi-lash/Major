package com.courselist.backend.dbCLasses;

import java.util.List;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="teacher_info")
@ToString
public class TeacherEntity {
    


    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    private String phnno;
    private String password;
    
     @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<CourseEntity> courses;

    public String getEmail() {
        return this.email;
    }
    
    public String getPassword() {
        return this.password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return this.id;
    }
    

    public String getName() {
        return this.name;
    }

    

}

