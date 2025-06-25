package com.murat.hastaneYonetim.repository;

import com.murat.hastaneYonetim.entity.Doctor;
import com.murat.hastaneYonetim.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByIdentityNumber(String identityNumber);
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserEmail(String email);

    List<Doctor> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    boolean existsByIdentityNumber(String identityNumber);

    boolean existsByEmail(String email);
}
