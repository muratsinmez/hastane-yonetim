// src/main/java/com/murat/hastaneYonetim/repository/IllnessRepository.java
package com.murat.hastaneYonetim.repository;

import com.murat.hastaneYonetim.entity.Illness;
import com.murat.hastaneYonetim.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IllnessRepository extends JpaRepository<Illness, Long> {
    List<Illness> findByPatient(Patient patient);
}
