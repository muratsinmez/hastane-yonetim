// src/pages/PatientDashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [pastIllnesses, setPastIllnesses] = useState<string[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingUpcoming, setLoadingUpcoming] = useState<boolean>(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token') ?? '';
  const authHeader = { Authorization: `Bearer ${token}` };

  // 1. Hasta profilini çek
  const fetchPatient = async () => {
    try {
      if (!token) {
        setError("Token bulunamadı.");
        return;
      }
      const identityRes = await axios.get<string>(
        "http://localhost:8080/api/auth/getIdentityNumber",
        { headers: authHeader }
      );
      const identityNumber = identityRes.data;

      const res = await axios.get(
        `http://localhost:8080/api/patients/get/${identityNumber}`,
        { headers: authHeader }
      );
      setPatient(res.data);
    } catch (err: any) {
      setError('Hasta verisi alınamadı: ' + err.message);
      console.error(err);
    }
  };

  // 2. Geçmiş rahatsızlıklar
  const fetchIllnesses = async () => {
    try {
      if (!token) return;
      const res = await axios.get<string[]>(
        "http://localhost:8080/api/patients/myIllnesses",
        { headers: authHeader }
      );
      setPastIllnesses(res.data);
    } catch (err) {
      console.error("Rahatsızlıklar alınamadı:", err);
    }
  };

  // 3. Geçmiş randevular
  const fetchPastAppointments = async () => {
    try {
      if (!token) return;
      const res = await axios.get<any[]>(
        "http://localhost:8080/api/appointments/myPast",
        { headers: authHeader }
      );
      setPastAppointments(res.data);
    } catch (err) {
      console.error("Geçmiş randevular alınamadı:", err);
    }
  };

  // 4. Bekleyen (güncel) randevular
  const fetchUpcomingAppointments = async () => {
    setLoadingUpcoming(true);
    try {
      if (!token) return;
      const res = await axios.get<any[]>(
        "http://localhost:8080/api/appointments/my",
        { headers: authHeader }
      );
      setUpcomingAppointments(res.data);
    } catch (err) {
      console.error("Güncel randevular alınamadı:", err);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchIllnesses();
    fetchPastAppointments();
    fetchUpcomingAppointments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hoş Geldiniz, {patient?.firstName ?? '...'} 👋
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Kişisel Bilgiler */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Kişisel Bilgiler</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              Ad Soyad: {patient?.firstName} {patient?.lastName}
            </Typography>
            <Typography>Doğum Tarihi: {patient?.birthDate}</Typography>
            <Typography>Cinsiyet: {patient?.gender}</Typography>
            <Typography>Email: {patient?.user?.email}</Typography>
            <Typography>Telefon: {patient?.phone}</Typography>
            <Typography>Adres: {patient?.address}</Typography>
          </Paper>
        </Grid>

        {/* Geçmiş Rahatsızlıklar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Geçirdiğiniz Rahatsızlıklar</Typography>
            <Divider sx={{ my: 1 }} />
            {pastIllnesses.length > 0 ? (
              pastIllnesses.map((ill, idx) => (
                <Typography key={idx}>• {ill}</Typography>
              ))
            ) : (
              <Typography color="textSecondary">
                Henüz bir rahatsızlık kaydınız yok.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Bekleyen (Güncel) Randevular */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Bekleyen Randevular</Typography>
            <Divider sx={{ my: 1 }} />
            {loadingUpcoming ? (
              <CircularProgress />
            ) : upcomingAppointments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doktor</TableCell>
                      <TableCell>Tarih</TableCell>
                      <TableCell>Saat</TableCell>
                      <TableCell>Durum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingAppointments.map((ap) => (
                      <TableRow key={ap.id}>
                        <TableCell>
                          {ap.doctor.firstName} {ap.doctor.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(ap.date).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>{ap.time}</TableCell>
                        <TableCell>{ap.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary">
                Henüz bekleyen randevunuz yok.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Geçmiş Randevular */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Geçmiş Randevular</Typography>
            <Divider sx={{ my: 1 }} />
            {pastAppointments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doktor</TableCell>
                      <TableCell>Tarih</TableCell>
                      <TableCell>Saat</TableCell>
                      <TableCell>Durum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastAppointments.map((ap) => (
                      <TableRow key={ap.id}>
                        <TableCell>
                          {ap.doctor.firstName} {ap.doctor.lastName}
                        </TableCell>
                        <TableCell>
                          {new Date(ap.date).toLocaleDateString('tr-TR')}
                        </TableCell>
                        <TableCell>{ap.time}</TableCell>
                        <TableCell>{ap.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary">
                Henüz geçmiş randevunuz yok.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Yeni Randevu Alma */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Yeni Randevu Al</Typography>
            <Divider sx={{ my: 1 }} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/new-appointment')}
            >
              Randevu Sayfasına Git
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;
