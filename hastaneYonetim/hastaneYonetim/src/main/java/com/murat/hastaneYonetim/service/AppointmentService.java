package com.murat.hastaneYonetim.service;

import com.murat.hastaneYonetim.entity.Appointment;
import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.repository.AppointmentRepository;
import com.murat.hastaneYonetim.repository.DoctorRepository;
import com.murat.hastaneYonetim.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserService userService;

    public Appointment bookAppointment(String patientEmail, Long doctorId, LocalDate date, LocalTime time) {
        Patient patient = patientRepository.findByUserEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));

        List<Appointment> existing = appointmentRepository.findByDoctorAndDate(doctor, date);
        for (Appointment a : existing) {
            if (a.getTime().equals(time)) {
                throw new RuntimeException("Bu saatte zaten randevu var");
            }
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(date);
        appointment.setTime(time);
        appointment.setStatus("BEKLIYOR");

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
        return appointmentRepository.findByPatient(patient);
    }

    public List<Appointment> getAppointmentsByDoctor(String email) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));
        return appointmentRepository.findByDoctorAndDate(doctor, LocalDate.now());
    }

    public Appointment updateAppointmentStatus(Long appointmentId, String newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı"));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long appointmentId, String newStatus, String doctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı"));

        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Bu randevu size ait değil.");
        }

        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    public List<LocalTime> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return Collections.emptyList();
        }

        List<LocalTime> slots = new ArrayList<>();
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(18, 0);

        while (start.isBefore(end)) {
            if (start.isBefore(LocalTime.of(12, 0)) || start.isAfter(LocalTime.of(13, 0))) {
                slots.add(start);
            }
            start = start.plusMinutes(30);
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doktor bulunamadı"));
        List<Appointment> appointments = appointmentRepository.findByDoctorAndDate(doctor, date);

        List<LocalTime> takenTimes = appointments.stream()
                .map(Appointment::getTime)
                .toList();

        return slots.stream()
                .filter(t -> !takenTimes.contains(t))
                .toList();
    }

    public List<Appointment> getPastAppointmentsByPatient(String email) {
        List<Appointment> all = getAppointmentsByPatient(email);
        return all.stream()
                .filter(a -> a.getDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }

    public List<Appointment> getUpcomingAppointmentsByPatient(String patientEmail) {
        LocalDate today = LocalDate.now();
        return appointmentRepository.findByPatientEmail(patientEmail).stream()
                .filter(app -> !app.getDate().isBefore(today))   // bugün ve sonrası
                .collect(Collectors.toList());
    }


}
