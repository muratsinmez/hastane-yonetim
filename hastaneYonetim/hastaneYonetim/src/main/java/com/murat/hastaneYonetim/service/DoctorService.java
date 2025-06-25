package com.murat.hastaneYonetim.service;

import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.enums.UserRole;
import com.murat.hastaneYonetim.repository.DoctorRepository;
import com.murat.hastaneYonetim.repository.PatientRepository;
import com.murat.hastaneYonetim.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // eklendi

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Doctor getDoctorByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));
    }

    public List<Patient> getPatientsForDoctor(String doctorEmail) {
        Doctor doctor = getDoctorByEmail(doctorEmail);
        return doctor.getPatients();
    }

    public Patient getPatientDetailsForDoctor(String doctorEmail, String patientIdentityNumber) {
        Doctor doctor = getDoctorByEmail(doctorEmail);
        Patient patient = patientRepository.findByIdentityNumber(patientIdentityNumber)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));

        if (!doctor.getPatients().contains(patient)) {
            throw new RuntimeException("Bu hasta bu doktora ait değil");
        }

        return patient;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorByIdentityNumber(String identityNumber) {
        return doctorRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı!"));
    }


    @Transactional
    public Doctor createDoctor(Doctor doctor, String rawPassword) {
        if (userRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Bu email zaten kullanımda.");
        }

        User user = User.builder()
                .email(doctor.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .role(UserRole.DOKTOR)
                .enabled(true)
                .build();

        userRepository.save(user);

        doctor.setUser(user);
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String identityNumber, Doctor updatedDoctor) {
        Doctor doctor = getDoctorByIdentityNumber(identityNumber);

        doctor.setFirstName(updatedDoctor.getFirstName());
        doctor.setLastName(updatedDoctor.getLastName());
        doctor.setPhoneNumber(updatedDoctor.getPhoneNumber());
        doctor.setEmail(updatedDoctor.getEmail());
        doctor.setAddress(updatedDoctor.getAddress());
        doctor.setBirthDate(updatedDoctor.getBirthDate());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setIdentityNumber(updatedDoctor.getIdentityNumber());

        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String identityNumber) {
        Doctor doctor = getDoctorByIdentityNumber(identityNumber);
        doctorRepository.delete(doctor);
    }

    public Doctor getDoctorByUser(User user) {
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));
    }

    public List<Doctor> searchByName(String name) {
        return doctorRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

}
