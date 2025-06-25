// src/components/NewAppointment.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

interface Doctor {
  id: number;
  name: string;
  department: string;
}

const NewAppointment: React.FC = () => {
  const [doctorQuery, setDoctorQuery] = useState('');
  const [doctorOptions, setDoctorOptions] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [booking, setBooking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Doktor arama (debounce ile geliştirilebilir)
  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctorQuery.trim() === '') {
        setDoctorOptions([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Doctor[]>('http://localhost:8080/api/doctors/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: doctorQuery },
        });
        setDoctorOptions(response.data);
      } catch (err) {
        console.error('Doktorlar alınamadı:', err);
      }
    };

    fetchDoctors();
  }, [doctorQuery]);

  const fetchSlots = async () => {
    if (!selectedDoctor || selectedDate === '') {
      setError('Lütfen doktor ve tarih seçin.');
      return;
    }

    setLoadingSlots(true);
    setError(null);
    setSuccess(null);
    setSlots([]);
    setSelectedTime('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<string[]>(
        'http://localhost:8080/api/appointments/availableSlots',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            doctorId: selectedDoctor.id,
            date: selectedDate,
          },
        }
      );
      setSlots(response.data);
      if (response.data.length === 0) {
        setError('Bu tarih için uygun saat bulunamadı.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Uygun saatler alınamadı.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!selectedDoctor || selectedDate === '' || selectedTime === '') {
      setError('Doktor, tarih ve saat seçmelisiniz.');
      return;
    }

    setBooking(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const body = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
      };
      const response = await axios.post('http://localhost:8080/api/appointments/book', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Randevu oluşturuldu:', response.data);
      setSuccess('Randevu başarıyla oluşturuldu!');
      setSelectedDoctor(null);
      setSelectedDate('');
      setSlots([]);
      setSelectedTime('');
    } catch (err: any) {
      console.error(err);
      setError('Randevu alınırken hata oluştu.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Yeni Randevu Al
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={doctorOptions}
              getOptionLabel={(option) => `${option.name} (${option.department})`}
              onInputChange={(event, value) => setDoctorQuery(value)}
              onChange={(event, value) => {
                setSelectedDoctor(value);
                setSlots([]);
                setSelectedTime('');
                setError(null);
                setSuccess(null);
              }}
              value={selectedDoctor}
              renderInput={(params) => (
                <TextField {...params} label="Doktor Ara (isim ile)" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tarih"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSlots([]);
                setSelectedTime('');
                setError(null);
                setSuccess(null);
              }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={fetchSlots}
          disabled={loadingSlots || !selectedDoctor || selectedDate === ''}
          sx={{ mb: 3 }}
        >
          {loadingSlots ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Uygun Saatleri Getir'}
        </Button>

        {slots.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="time-select-label">Uygun Saat</InputLabel>
            <Select
              labelId="time-select-label"
              value={selectedTime}
              label="Uygun Saat"
              onChange={(e) => {
                setSelectedTime(e.target.value as string);
                setError(null);
                setSuccess(null);
              }}
            >
              {slots.map((timeStr) => (
                <MenuItem key={timeStr} value={timeStr}>
                  {timeStr}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          disabled={booking || selectedTime === '' || slots.length === 0}
          onClick={handleBook}
        >
          {booking ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Randevu Al'}
        </Button>
      </Paper>
    </Container>
  );
};

export default NewAppointment;
