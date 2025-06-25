package com.murat.hastaneYonetim.controller;

import com.murat.hastaneYonetim.dto.AppointmentStatusUpdateRequest;
import com.murat.hastaneYonetim.dto.DoctorSearchDto;
import com.murat.hastaneYonetim.entity.Appointment;
import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.service.AppointmentService;
import com.murat.hastaneYonetim.service.DoctorService;
import com.murat.hastaneYonetim.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyInfo(Authentication authentication) {
        String email = authentication.getName();
        Doctor doctor = doctorService.getDoctorByEmail(email);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/myPatients")
    public ResponseEntity<List<Patient>> getMyPatients(Authentication authentication) {
        String email = authentication.getName();
        List<Patient> patients = doctorService.getPatientsForDoctor(email);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/myPatients/{identityNumber}")
    public ResponseEntity<Patient> getPatientDetails(@PathVariable String identityNumber,
                                                     Authentication authentication) {
        String email = authentication.getName();
        Patient patient = doctorService.getPatientDetailsForDoctor(email, identityNumber);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/myAppointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(email);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long appointmentId,
                                                               @RequestBody @Valid AppointmentStatusUpdateRequest request,
                                                               Authentication authentication) {
        String email = authentication.getName();
        Appointment updated = appointmentService.updateAppointmentStatus(appointmentId, request.getStatus(), email);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{identityNumber}")
    public ResponseEntity<Doctor> getDoctorByIdentityNumber(
            @PathVariable String identityNumber) {

        Doctor doctor = doctorService.getDoctorByIdentityNumber(identityNumber);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorSearchDto>> searchDoctors(@RequestParam String name) {
        List<Doctor> doctors = doctorService.searchByName(name);
        List<DoctorSearchDto> dto = doctors.stream()
                .map(d -> new DoctorSearchDto(
                        d.getId(),
                        d.getFirstName() + " " + d.getLastName(),
                        d.getSpecialization()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }
}
