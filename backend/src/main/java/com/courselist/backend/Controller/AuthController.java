package com.courselist.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @PostMapping("/logout") // <- This must exist
    public ResponseEntity<String> logout(HttpServletRequest request) {
        request.getSession().invalidate(); // destroy session
        return ResponseEntity.ok("Logged out successfully");
    }
}


