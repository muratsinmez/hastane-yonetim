package com.murat.hastaneYonetim.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true, length = 11)
    private String identityNumber;

    @Column(nullable = false)
    @Size(min = 10, max = 10, message = "Telefon numaranızı başında 0 olmadan 10 haneli olacak şekilde giriniz: ")
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private String address;

    private LocalDate birthDate;

    @Column(nullable = false)
    private String specialization;

    @OneToMany(mappedBy = "doctor")
    private List<Patient> patients = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

}
