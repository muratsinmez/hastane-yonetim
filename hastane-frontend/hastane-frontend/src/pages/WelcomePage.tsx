import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ marginTop: '5rem', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Hoş Geldiniz 👋
      </Typography>
      <Typography variant="body1" paragraph>
        Bu uygulama üzerinden randevu alabilir, ilaçlarınızı takip edebilir ve yan etkileri bildirebilirsiniz.
        Sadece hastalar kayıt olabilir. Doktor ve personel hesapları sistem yöneticisi tarafından eklenir.
      </Typography>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/login')}
          style={{ marginRight: '1rem' }}
        >
          Giriş Yap
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
        >
          Kayıt Ol
        </Button>
      </Box>
    </Container>
  );
};

export default WelcomePage;
