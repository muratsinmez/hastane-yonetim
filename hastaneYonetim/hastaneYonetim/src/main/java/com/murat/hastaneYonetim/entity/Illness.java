// src/main/java/com/murat/hastaneYonetim/entity/Illness.java
package com.murat.hastaneYonetim.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "illnesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Illness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
}
