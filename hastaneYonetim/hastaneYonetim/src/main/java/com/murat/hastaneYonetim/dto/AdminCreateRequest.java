package com.murat.hastaneYonetim.dto;

import lombok.Data;


@Data
public class AdminCreateRequest {
    private String email;
    private String password;
    private String secretCode;
}
