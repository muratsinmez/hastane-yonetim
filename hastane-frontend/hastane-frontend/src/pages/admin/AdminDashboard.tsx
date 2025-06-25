// src/pages/admin/AdminDashboard.tsx

import React from 'react';
import { Container, Typography, Grid, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Paneline Hoşgeldiniz
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Hasta Yönetimi
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/patients')}
            >
              Hastaları Görüntüle
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Doktor Yönetimi
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/admin/doctors')}
            >
              Doktorları Görüntüle
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
