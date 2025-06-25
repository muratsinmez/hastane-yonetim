// src/pages/doctor/DoctorDashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

interface Appointment {
  id: number;
  date: string;      // Örn. "2025-06-10"
  time: string;      // Örn. "14:30:00"
  patientIdentity: string;
  patientName: string;
  status: string;    // Örn. "PENDING", "BOOKED", "BEKLIYOR", "CONFIRMED", "COMPLETED", "NO_SHOW", "ONAYLANDI" ...
}

interface DoctorInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
}

const DoctorDashboard: React.FC = () => {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const [loadingAppts, setLoadingAppts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  // Status’ü hem İngilizce hem Türkçe karşılıklarıyla kontrol etmemizi sağlayan yardımcılar:
  const isPending = (status: string) =>
    ['PENDING', 'BOOKED', 'BEKLIYOR'].includes(status.toUpperCase());
  const isConfirmed = (status: string) =>
    ['CONFIRMED', 'ONAYLANDI'].includes(status.toUpperCase());

  // 1. Doktor bilgilerini çek
  const fetchDoctorInfo = async (): Promise<void> => {
    setLoadingInfo(true);
    setError(null);
    try {
      const resp = await axios.get<DoctorInfo>(
        'http://localhost:8080/api/doctors/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctor(resp.data);
    } catch (err) {
      console.error('Doktor bilgileri alınırken hata:', err);
      setError('Doktor bilgileri alınırken hata oluştu.');
    } finally {
      setLoadingInfo(false);
    }
  };

  // 2. Randevuları çek
  const fetchAppointments = async (): Promise<void> => {
    setLoadingAppts(true);
    setError(null);
    try {
      const resp = await axios.get<any[]>(
        'http://localhost:8080/api/appointments/mySchedule',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const mapped: Appointment[] = resp.data.map(a => ({
        id: a.id,
        date: a.date,
        time: a.time,
        patientIdentity: a.patient.identityNumber,
        patientName: `${a.patient.firstName} ${a.patient.lastName}`,
        status: a.status,
      }));
      setAppointments(mapped);
    } catch (err) {
      console.error('Randevular alınırken hata:', err);
      setError('Randevular alınırken hata oluştu.');
    } finally {
      setLoadingAppts(false);
    }
  };

  // 3. Durumu güncelle
  const handleUpdateStatus = async (appointmentId: number, newStatus: string): Promise<void> => {
    setUpdatingId(appointmentId);
    setError(null);
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/updateStatus/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(prev =>
        prev.map(ap => ap.id === appointmentId ? { ...ap, status: newStatus } : ap)
      );
    } catch (err) {
      console.error('Durum güncellenirken hata:', err);
      setError('Randevu durumu güncellenirken hata oluştu.');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
    fetchAppointments();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doktor Paneli
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Doktor Bilgileri */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Bilgileriniz</Typography>
        <Divider sx={{ my: 1 }} />

        {loadingInfo ? (
          <CircularProgress />
        ) : doctor ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography>
                Ad Soyad: {doctor.firstName} {doctor.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>E-Posta: {doctor.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>Telefon: {doctor.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography>Uzmanlık: {doctor.specialization}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Bilgi bulunamadı.</Typography>
        )}
      </Paper>

      {/* Randevu Listesi */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Randevularınız</Typography>
        <Divider sx={{ my: 1 }} />

        {loadingAppts ? (
          <Grid container justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Hasta Kimlik</TableCell>
                  <TableCell>Hasta Adı</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Saat</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map(ap => (
                    <TableRow key={ap.id}>
                      <TableCell>{ap.id}</TableCell>
                      <TableCell>{ap.patientIdentity}</TableCell>
                      <TableCell>{ap.patientName}</TableCell>
                      <TableCell>
                        {new Date(ap.date).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell>{ap.time}</TableCell>
                      <TableCell>{ap.status}</TableCell>
                      <TableCell>
                        {/* Bekliyor durumları için Onayla/İptal et */}
                        {isPending(ap.status) && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled={updatingId === ap.id}
                              onClick={() => handleUpdateStatus(ap.id, 'CONFIRMED')}
                              sx={{ mr: 1 }}
                            >
                              {updatingId === ap.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                'Onayla'
                              )}
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              disabled={updatingId === ap.id}
                              onClick={() => handleUpdateStatus(ap.id, 'CANCELLED')}
                            >
                              {updatingId === ap.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                'İptal Et'
                              )}
                            </Button>
                          </>
                        )}

                        {/* Onaylandı durumunda muayene et/Gelmiyor */}
                        {isConfirmed(ap.status) && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              disabled={updatingId === ap.id}
                              onClick={() => handleUpdateStatus(ap.id, 'COMPLETED')}
                              sx={{ mr: 1 }}
                            >
                              {updatingId === ap.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                'Muayene Edildi'
                              )}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              disabled={updatingId === ap.id}
                              onClick={() => handleUpdateStatus(ap.id, 'NO_SHOW')}
                            >
                              {updatingId === ap.id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                'Gelmedi'
                              )}
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Henüz hiçbir randevunuz yok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default DoctorDashboard;
