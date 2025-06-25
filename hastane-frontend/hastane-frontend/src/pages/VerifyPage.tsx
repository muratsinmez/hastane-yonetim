import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kayıt sırasında email localStorage'a kaydedildiyse otomatik doldur
    const storedEmail = localStorage.getItem('registeringEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/verify', {
        email,
        otp,
      });

      alert('Doğrulama başarılı! Artık giriş yapabilirsiniz.');
      localStorage.removeItem('registeringEmail'); // temizle
      navigate('/login');
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || 'Sunucu hatası.';
      alert('Doğrulama başarısız: ' + message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        OTP Doğrulama
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lütfen e-posta adresinize gelen 6 haneli kodu giriniz.
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
      >
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="OTP Kod"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          margin="normal"
          inputProps={{ maxLength: 6 }}
        />
        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mt: 2 }}
          type="submit"
        >
          Doğrula
        </Button>
      </form>
    </Container>
  );
};

export default VerifyPage;
