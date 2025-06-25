package com.murat.hastaneYonetim.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Hastane Yönetim Sistemi - OTP Doğrulama Kodu");
        message.setText("Merhaba,\n\nHesabınızı doğrulamak için OTP kodunuz: " + otpCode + "\n\nBu kod 5 dakika geçerlidir.");
        mailSender.send(message);
    }
}
