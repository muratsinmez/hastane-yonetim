// src/main/java/com/murat/hastaneYonetim/dto/DoctorSearchDto.java
package com.murat.hastaneYonetim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSearchDto {
    private Long id;
    private String name;   // isim+soy isim kullanılır
    private String department;
}
