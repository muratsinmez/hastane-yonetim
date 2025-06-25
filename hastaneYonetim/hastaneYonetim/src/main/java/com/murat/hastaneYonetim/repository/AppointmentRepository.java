package com.murat.hastaneYonetim.repository;

import com.murat.hastaneYonetim.entity.Appointment;
import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndDate(Doctor doctor, LocalDate date);
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByPatientEmail(String email);

}
