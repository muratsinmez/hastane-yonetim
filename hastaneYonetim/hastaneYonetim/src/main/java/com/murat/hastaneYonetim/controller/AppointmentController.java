package com.murat.hastaneYonetim.controller;

import com.murat.hastaneYonetim.dto.AppointmentRequest;
import com.murat.hastaneYonetim.dto.AppointmentStatusUpdateRequest;
import com.murat.hastaneYonetim.entity.Appointment;
import com.murat.hastaneYonetim.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request,
                                             Authentication authentication) {
        String email = authentication.getName();
        Appointment appointment = appointmentService.bookAppointment(
                email,
                request.getDoctorId(),
                request.getDate(),
                request.getTime()
        );
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(email));
    }

    @GetMapping("/mySchedule")
    public ResponseEntity<List<Appointment>> getMySchedule(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(email));
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody AppointmentStatusUpdateRequest request) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/availableSlots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(@RequestParam Long doctorId,
                                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(doctorId, date));
    }

    @GetMapping("/myPast")
    public ResponseEntity<List<Appointment>> getMyPast(
            Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(
                appointmentService.getPastAppointmentsByPatient(email)
        );
    }
    @GetMapping("/upcoming")
    public ResponseEntity<List<Appointment>> getMyUpcomingAppointments(Authentication authentication) {
        String email = authentication.getName();
        List<Appointment> upcoming = appointmentService.getUpcomingAppointmentsByPatient(email);
        return ResponseEntity.ok(upcoming);
    }
}
