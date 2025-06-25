package com.murat.hastaneYonetim.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

// Illness entity’sini import edin
import com.murat.hastaneYonetim.entity.Illness;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Illness> pastIllnesses;

    @NotBlank(message = "İsim boş olamaz")
    private String firstName;

    @NotBlank(message = "Soy İsim boş olamaz")
    private String lastName;

    @NotBlank(message = "TC Kimlik Numarası boş olamaz")
    @Size(min = 11, max = 11, message = "TC Kimlik Numarası 11 haneli olmamalıdır.")
    private String identityNumber;

    @NotNull
    private LocalDate birthDate;

    private String gender;

    @NotBlank(message = "Lütfen Telefon numaranızı başında 0 olmadan 10 haneli olacak şekilde giriniz : ")
    @Column(nullable = false)
    private String phone;

    private String relativePhoneNumber;

    @Column(nullable = false)
    private String address;

    private String department;

    @Column(nullable = false)
    private String policyType;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String email;
}
