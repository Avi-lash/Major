package com.courselist.backend.dbCLasses;

import jakarta.persistence.*;


import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "yt_courses")
public class Course {

    @Id
    private  String id;

    private  String title;

   
}