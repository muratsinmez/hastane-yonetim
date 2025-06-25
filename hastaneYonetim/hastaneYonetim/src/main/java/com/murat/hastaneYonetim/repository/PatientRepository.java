package com.murat.hastaneYonetim.repository;

import com.murat.hastaneYonetim.entity.Patient;
import com.murat.hastaneYonetim.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByIdentityNumber(String identityNumber);
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByUserEmail(String email);

    List<Patient> findByFirstNameAndLastName(String firstName, String lastName);
}
