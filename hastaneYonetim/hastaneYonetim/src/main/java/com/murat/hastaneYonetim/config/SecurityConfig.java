package com.murat.hastaneYonetim.config;

import com.murat.hastaneYonetim.filter.JwtAuthenticationFilter;
import com.murat.hastaneYonetim.service.UserService;
import com.murat.hastaneYonetim.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS ayarları. React uygulamanız http://localhost:3000’den istek atacak.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(UserService userService, JwtUtil jwtUtil) {
        return new JwtAuthenticationFilter(userService, jwtUtil);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth


                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/getIdentityNumber",
                                "/api/admin/create"
                        ).permitAll()


                        .requestMatchers(
                                "/api/patients/me",
                                "/api/patients/update/**",
                                "/api/appointments/book",
                                "/api/appointments/my",
                                "/api/doctors/search"
                        ).hasRole("HASTA")


                        .requestMatchers(
                                "/api/doctors/me",
                                "/api/doctors/myAppointments",
                                "/api/doctors/myPatients/**",
                                "/api/appointments/updateStatus/**",
                                "/api/appointments/mySchedule",
                                "/api/appointments/upcoming"

                        ).hasRole("DOKTOR")
                        .requestMatchers("/api/appointments/**").hasAnyRole("HASTA", "DOKTOR")

                        .requestMatchers("api/auth/**").hasRole("ADMIN")
                        .requestMatchers("api/appointments/**").hasRole("ADMIN")


                        .requestMatchers("/api/admin/**").hasRole("ADMIN")


                        .requestMatchers("/api/patients/**").hasAnyRole("HASTA", "ADMIN")


                        .anyRequest().authenticated()
                );


        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
