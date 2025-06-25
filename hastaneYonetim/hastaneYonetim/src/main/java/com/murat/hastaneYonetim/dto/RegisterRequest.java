package com.murat.hastaneYonetim.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class RegisterRequest {
    private String email;
    private String password;

    private String firstName;
    private String lastName;
    private String identityNumber;
    private LocalDate birthDate;
    private String gender;
    private String phone;
    private String relativePhoneNumber;
    private String address;
    private String department;
    private String policyType;
}
