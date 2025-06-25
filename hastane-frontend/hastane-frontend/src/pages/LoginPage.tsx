import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
  ButtonBase,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, InvalidTokenError } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  roles?: string[];
  // Diğer alanlar backend’in gönderdiğine bağlı olarak eklenebilir
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Lütfen email ve şifre girin.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<{ token: string }>(
        'http://localhost:8080/api/auth/login',
        { email, password }
      );

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Token'ı decode ederek role bilgisini al
      let decoded: DecodedToken = {};
      try {
        decoded = jwtDecode(token) as DecodedToken;
      } catch (decodeErr) {
        console.error('JWT decode hatası:', decodeErr);
      }

      let role: string | undefined;
      if (decoded.role) {
        role = decoded.role;
      } else if (decoded.roles && decoded.roles.length > 0) {
        role = decoded.roles[0];
      }

      // Role'a göre yönlendirme
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'DOKTOR' || role === 'DOCTOR') {
        navigate('/doctor');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError('Giriş başarısız! Email veya şifre yanlış olabilir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5rem' }}>
      <Typography variant="h4" gutterBottom>
        Giriş Yap
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Şifre"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
      </Button>

      <Button
        variant="text"
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate('/forgot-password')}
      >
        Şifremi Unuttum
      </Button>
    </Container>
  );
};

export default LoginPage;
