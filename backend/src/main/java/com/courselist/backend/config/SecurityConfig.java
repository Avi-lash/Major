package com.courselist.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow public access to registration
                
            )
            .csrf(csrf -> csrf.disable()) // Disable CSRF (for APIs)
            
            // .oauth2Login(oauth2 -> oauth2 // Enable Google Login
            //     .defaultSuccessUrl("http://localhost:5173/googlesignup", true) // Redirect to React frontend on success
            // )
            .formLogin(form -> form.disable()) // Disable login form
            .httpBasic(basic -> basic.disable())
            .cors()
            ; // Disable Basic Auth

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt for password hashing
    }

    
}
// package com.courselist.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//         .authorizeHttpRequests(auth -> auth
//                 .anyRequest().permitAll() // Allow public access to registration

//             )
//             .csrf().disable()
//             .cors() // enable CORS
//             .and()
//             .authorizeHttpRequests()
//             .anyRequest().permitAll(); // allow all requests

//         return http.build();
//     }
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//                 return new BCryptPasswordEncoder(); // Use BCrypt for password hashing
//             }
// }

