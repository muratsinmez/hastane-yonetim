package com.murat.hastaneYonetim.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private LocalDate date;
    private LocalTime time;
}
