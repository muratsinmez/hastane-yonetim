package com.murat.hastaneYonetim.service;

import com.murat.hastaneYonetim.entity.Illness;
import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import com.murat.hastaneYonetim.repository.IllnessRepository;
import com.murat.hastaneYonetim.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private IllnessRepository illnessRepository;


    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    public Patient getPatientByIdentityNumber(String identityNumber) {
        return patientRepository.findByIdentityNumber(identityNumber)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı!"));
    }
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }
    public Patient updatePatientByIdentityNumber(String identityNumber, Patient updatedPatient) {
        Patient patient = getPatientByIdentityNumber(identityNumber);

        patient.setFirstName(updatedPatient.getFirstName());
        patient.setLastName(updatedPatient.getLastName());
        patient.setBirthDate(updatedPatient.getBirthDate());
        patient.setGender(updatedPatient.getGender());
        patient.setPhone(updatedPatient.getPhone());
        patient.setAddress(updatedPatient.getAddress());
        patient.setIdentityNumber(updatedPatient.getIdentityNumber());
        patient.setEmail(updatedPatient.getEmail());
        return patientRepository.save(patient);
    }
    public void deletePatientByIdentityNumber(String identityNumber) {
        Patient patient = getPatientByIdentityNumber(identityNumber);
        patientRepository.delete(patient);
    }
    public List<Patient> getPatientsByNameAndSurname(String firstName, String lastName) {
        return patientRepository.findByFirstNameAndLastName(firstName, lastName);
    }

    public Patient getPatientByUser(User user) {
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
    }
    public Patient getByUser(User user) {
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
    }

    public List<String> getPastIllnessesByEmail(String email) {
        Patient patient = patientRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı"));
        List<Illness> list = illnessRepository.findByPatient(patient);
        return list.stream()
                .map(Illness::getName)
                .collect(Collectors.toList());
    }
}
