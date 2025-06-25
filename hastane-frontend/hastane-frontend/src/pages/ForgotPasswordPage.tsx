import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/request-password-reset', {
        email,
      });

      alert('OTP e-posta adresinize gönderildi.');
      navigate('/reset-password'); // OTP ve yeni şifreyi gireceği sayfa
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || 'Sunucu hatası.';
      alert('Gönderim başarısız: ' + message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Şifremi Unuttum
      </Typography>
      <Typography variant="body1" gutterBottom>
        Şifrenizi sıfırlamak için e-posta adresinize bir doğrulama kodu göndereceğiz.
      </Typography>

      <TextField
        fullWidth
        label="E-posta Adresi"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleRequestOTP}
      >
        Sıfırlama e-postası Gönder
      </Button>
    </Container>
  );
};

export default ForgotPasswordPage;
