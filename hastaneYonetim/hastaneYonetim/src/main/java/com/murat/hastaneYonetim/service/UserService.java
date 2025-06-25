package com.murat.hastaneYonetim.service;

import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.enums.UserRole;
import com.murat.hastaneYonetim.repository.PatientRepository;
import com.murat.hastaneYonetim.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PatientRepository patientRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User registerUser(String email, String password, UserRole role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Bu e-posta zaten kullanılıyor.");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))  // Şifre hashleniyor
                .role(role)
                .enabled(false) // OTP doğrulanınca true yapılır
                .build();

        return userRepository.save(user);
    }

    public boolean login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();

        return user.isEnabled() && passwordEncoder.matches(password, user.getPassword());
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public String generateOtp() {
        int code = 100000 + new Random().nextInt(900000); // 6 haneli OTP
        return String.valueOf(code);
    }

    public User createAdmin(String email, String password, String secretCode) {
        if (!secretCode.equals("YalnızBunuBilenAdminOlur123")) {
            throw new RuntimeException("Geçersiz güvenlik kodu");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        User admin = new User();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password)); // BCrypt ile hashle
        admin.setRole(UserRole.ADMIN);
        admin.setEnabled(true);

        return userRepository.save(admin);
    }
}
