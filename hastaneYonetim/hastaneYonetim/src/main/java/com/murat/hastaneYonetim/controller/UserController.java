package com.murat.hastaneYonetim.controller;

import com.murat.hastaneYonetim.dto.LoginRequest;
import com.murat.hastaneYonetim.dto.OtpVerifyRequest;
import com.murat.hastaneYonetim.dto.RegisterRequest;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.enums.UserRole;
import com.murat.hastaneYonetim.repository.UserRepository;
import com.murat.hastaneYonetim.service.MailService;
import com.murat.hastaneYonetim.service.PatientService;
import com.murat.hastaneYonetim.service.UserService;
import com.murat.hastaneYonetim.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.murat.hastaneYonetim.service.MailService.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserController(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request.getEmail(), request.getPassword(), UserRole.HASTA);

        String otp = userService.generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(5));
        userService.save(user);

        mailService.sendOtpEmail(user.getEmail(), otp);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setIdentityNumber(request.getIdentityNumber());
        patient.setBirthDate(request.getBirthDate());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setRelativePhoneNumber(request.getRelativePhoneNumber());
        patient.setAddress(request.getAddress());
        patient.setDepartment(request.getDepartment());
        patient.setPolicyType(request.getPolicyType());

        patientService.createPatient(patient);

        return ResponseEntity.ok("Kayıt başarılı. OTP kodu e-postanıza gönderildi.");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled() && passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                return ResponseEntity.ok(Map.of("token", token));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Geçersiz kimlik bilgileri");
    }



    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody OtpVerifyRequest request) {

        return userService.findByEmail(request.getEmail()).map(user -> {
            if (!request.getOtp().equals(user.getOtpCode())) {
                return ResponseEntity.badRequest().body("OTP kodu yanlış.");
            }
            if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("OTP kodunun süresi dolmuş.");
            }

            user.setEnabled(true);
            user.setOtpCode(null);
            user.setOtpExpiresAt(null);
            userService.save(user);

            return ResponseEntity.ok("Doğrulama başarılı. Hesabınız aktif.");
        }).orElse(ResponseEntity.badRequest().body("Kullanıcı bulunamadı."));
    }

    @GetMapping("/getIdentityNumber")
    public ResponseEntity<String> getIdentityNumber(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token yok.");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kullanıcı bulunamadı.");
        }

        User user = userOpt.get();
        Patient patient = patientService.getByUser(user); // Bu metodu service'te yazman gerek
        return ResponseEntity.ok(patient.getIdentityNumber());
    }

}
