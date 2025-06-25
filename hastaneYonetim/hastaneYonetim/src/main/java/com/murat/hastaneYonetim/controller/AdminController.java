package com.murat.hastaneYonetim.controller;

import com.murat.hastaneYonetim.dto.AdminCreateRequest;
import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.service.DoctorService;
import com.murat.hastaneYonetim.service.PatientService;
import com.murat.hastaneYonetim.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserService userService;


    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/{identityNumber}")
    public ResponseEntity<Doctor> getDoctorByIdentityNumber(@PathVariable String identityNumber) {
        return ResponseEntity.ok(doctorService.getDoctorByIdentityNumber(identityNumber));
    }

    @PostMapping("/add/doctors")
    public ResponseEntity<Doctor> createDoctor(@Valid @RequestBody Doctor doctor,
                                               @RequestParam String password) {
        Doctor createdDoctor = doctorService.createDoctor(doctor, password);
        return new ResponseEntity<>(createdDoctor, HttpStatus.CREATED);
    }

    @PutMapping("/doctors/{identityNumber}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String identityNumber,
                                               @Valid @RequestBody Doctor updatedDoctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(identityNumber, updatedDoctor));
    }

    @DeleteMapping("/doctors/{identityNumber}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String identityNumber) {
        doctorService.deleteDoctor(identityNumber);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/patients/{identityNumber}")
    public ResponseEntity<Patient> getPatientByIdentityNumber(@PathVariable String identityNumber) {
        return ResponseEntity.ok(patientService.getPatientByIdentityNumber(identityNumber));
    }

    @PostMapping("/add/patients")
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        Patient createdPatient = patientService.createPatient(patient);
        return new ResponseEntity<>(createdPatient, HttpStatus.CREATED);
    }

    @PutMapping("/patients/{identityNumber}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String identityNumber,
                                                 @Valid @RequestBody Patient updatedPatient) {
        return ResponseEntity.ok(patientService.updatePatientByIdentityNumber(identityNumber, updatedPatient));
    }

    @DeleteMapping("/patients/{identityNumber}")
    public ResponseEntity<Void> deletePatient(@PathVariable String identityNumber) {
        patientService.deletePatientByIdentityNumber(identityNumber);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/create")
    public ResponseEntity<String> createAdmin(@RequestBody AdminCreateRequest request) {
        try {
            User admin = userService.createAdmin(
                    request.getEmail(),
                    request.getPassword(),
                    request.getSecretCode()
            );
            return ResponseEntity.ok("Admin başarıyla oluşturuldu: " + admin.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Hata: " + e.getMessage());
        }
    }
}
