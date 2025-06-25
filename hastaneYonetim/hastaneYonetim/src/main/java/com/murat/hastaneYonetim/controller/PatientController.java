package com.murat.hastaneYonetim.controller;

import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.service.PatientService;
import com.murat.hastaneYonetim.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserService userService;

    // 🔐 SADECE ADMIN'e açık olması gerekir
    @GetMapping("/getAllPatients")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/get/{identityNumber}")
    public Patient getPatientByIdentityNumber(@PathVariable String identityNumber) {
        return patientService.getPatientByIdentityNumber(identityNumber);
    }

    @PostMapping("/add")
    public Patient createPatient(@Valid @RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }

    @PutMapping("/update/{identityNumber}")
    public Patient updatePatient(@PathVariable String identityNumber,
                                 @Valid @RequestBody Patient updatedPatient) {
        return patientService.updatePatientByIdentityNumber(identityNumber, updatedPatient);
    }

    @DeleteMapping("/delete/{identityNumber}")
    public void deletePatient(@PathVariable String identityNumber) {
        patientService.deletePatientByIdentityNumber(identityNumber);
    }

    @GetMapping("/search")
    public List<Patient> getPatientsByNameAndSurname(@RequestParam String firstName,
                                                     @RequestParam String lastName) {
        return patientService.getPatientsByNameAndSurname(firstName, lastName);
    }

    @GetMapping("/me")
    public ResponseEntity<Patient> getMyInfo(Authentication authentication) {
        String email = authentication.getName();

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Patient patient = patientService.getPatientByUser(user);
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/me/update")
    public ResponseEntity<Patient> updateMyInfo(Authentication authentication,
                                                @Valid @RequestBody Patient updatedPatient) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Patient existingPatient = patientService.getPatientByUser(user);

        existingPatient.setFirstName(updatedPatient.getFirstName());
        existingPatient.setLastName(updatedPatient.getLastName());
        existingPatient.setBirthDate(updatedPatient.getBirthDate());
        existingPatient.setGender(updatedPatient.getGender());
        existingPatient.setPhone(updatedPatient.getPhone());
        existingPatient.setRelativePhoneNumber(updatedPatient.getRelativePhoneNumber());
        existingPatient.setAddress(updatedPatient.getAddress());
        existingPatient.setDepartment(updatedPatient.getDepartment());
        existingPatient.setPolicyType(updatedPatient.getPolicyType());

        Patient saved = patientService.createPatient(existingPatient);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/myIllnesses")
    public ResponseEntity<List<String>> getMyIllnesses(
            Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(
                patientService.getPastIllnessesByEmail(email)
        );
    }
}
