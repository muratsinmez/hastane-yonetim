// src/pages/admin/AdminDoctorsPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

interface Doctor {
  identityNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;  // Backend’de “specialization” olarak saklanıyor
  address?: string;
  birthDate?: string;
}

const AdminDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchId, setSearchId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  // “specialty” yerine “specialization” kullanacağız, ve password ekledik
  const [formValues, setFormValues] = useState<Partial<Doctor> & { password?: string }>({});

  // Tüm doktorları getir
  const fetchAllDoctors = async () => {
    try {
      const res = await axios.get<Doctor[]>('http://localhost:8080/api/admin/doctors');
      setDoctors(res.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Doktorlar listelenirken hata oluştu.');
    }
  };

  // Kimlik numarasına göre arama
  const fetchDoctorById = async () => {
    if (searchId.trim() === '') {
      setError('Önce bir TC kimlik girin.');
      return;
    }
    try {
      const res = await axios.get<Doctor>(`http://localhost:8080/api/admin/doctors/${searchId}`);
      setDoctors([res.data]);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Doktor bulunamadı veya hata oluştu.');
    }
  };

  // Doktor silme
  const deleteDoctor = async (identityNumber: string) => {
    if (!window.confirm(`${identityNumber} kimlikli doktoru silmek istediğinize emin misiniz?`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/doctors/${identityNumber}`);
      setDoctors(prev => prev.filter(d => d.identityNumber !== identityNumber));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Doktor silinirken hata oluştu.');
    }
  };

  // Düzenleme dialogunu aç
  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormValues({ ...doctor });
    setIsEditDialogOpen(true);
    setError(null);
  };

  // Düzenleme kaydet
  const handleEditSave = async () => {
    if (!selectedDoctor) return;
    const idNo = selectedDoctor.identityNumber;
    try {
      await axios.put(
        `http://localhost:8080/api/admin/doctors/${idNo}`,
        {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          specialization: formValues.specialization,  // backend bekliyor
          address: formValues.address,
          birthDate: formValues.birthDate,
          identityNumber: formValues.identityNumber,
        }
      );
      setDoctors(prev =>
        prev.map(d =>
          d.identityNumber === idNo
            ? {
                identityNumber: idNo,
                firstName: formValues.firstName || d.firstName,
                lastName: formValues.lastName || d.lastName,
                email: formValues.email || d.email,
                phoneNumber: formValues.phoneNumber || d.phoneNumber,
                specialization: formValues.specialization || d.specialization,
                address: formValues.address || d.address,
                birthDate: formValues.birthDate || d.birthDate,
              }
            : d
        )
      );
      setIsEditDialogOpen(false);
      setSelectedDoctor(null);
      setFormValues({});
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Doktor güncellenirken hata oluştu.');
    }
  };

  // Yeni doktor ekleme dialogu aç
  const openAddDialog = () => {
    setFormValues({});
    setIsAddDialogOpen(true);
    setError(null);
  };

  // Yeni doktor ekle
  const handleAddSave = async () => {
    // Zorunlu alanları kontrol et
    if (
      !formValues.identityNumber ||
      !formValues.firstName ||
      !formValues.lastName ||
      !formValues.email ||
      !formValues.specialization ||    // artık “specialization” zorunlu
      !formValues.phoneNumber ||
      !formValues.password
    ) {
      setError('Kimlik, ad, soyad, e-posta, telefon, uzmanlık ve şifre zorunlu.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/admin/add/doctors',
        {
          identityNumber: formValues.identityNumber,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          specialization: formValues.specialization,
          address: formValues.address,
          birthDate: formValues.birthDate,
        },
        {
          params: { password: formValues.password },
        }
      );
      fetchAllDoctors();
      setIsAddDialogOpen(false);
      setFormValues({});
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Yeni doktor eklenirken hata oluştu.');
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doktor Yönetimi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="TC Kimlik No ile Ara"
            fullWidth
            value={searchId}
            onChange={e => {
              setSearchId(e.target.value);
              setError(null);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="outlined" onClick={fetchDoctorById} fullWidth>
            Ara
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} textAlign="right">
          <Button variant="contained" onClick={openAddDialog}>
            Yeni Doktor Ekle
          </Button>
          <Button variant="text" onClick={fetchAllDoctors} sx={{ ml: 2 }}>
            Tümünü Listele
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TC Kimlik</TableCell>
              <TableCell>Adı</TableCell>
              <TableCell>Soyadı</TableCell>
              <TableCell>E-Posta</TableCell>
              <TableCell>Uzmanlık</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(d => (
              <TableRow key={d.identityNumber}>
                <TableCell>{d.identityNumber}</TableCell>
                <TableCell>{d.firstName}</TableCell>
                <TableCell>{d.lastName}</TableCell>
                <TableCell>{d.email}</TableCell>
                <TableCell>{d.specialization}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => openEditDialog(d)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteDoctor(d.identityNumber)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Kayıtlı doktor bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Doktor Düzenleme Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} fullWidth>
        <DialogTitle>Doktor Bilgilerini Düzenle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="TC Kimlik No"
                fullWidth
                value={formValues.identityNumber || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adı"
                fullWidth
                value={formValues.firstName || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, firstName: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Soyadı"
                fullWidth
                value={formValues.lastName || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, lastName: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-Posta"
                type="email"
                fullWidth
                value={formValues.email || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, email: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon"
                fullWidth
                value={formValues.phoneNumber || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, phoneNumber: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Uzmanlık"
                fullWidth
                value={formValues.specialization || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, specialization: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Yeni Doktor Ekleme Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth>
        <DialogTitle>Yeni Doktor Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="TC Kimlik No"
                fullWidth
                value={formValues.identityNumber || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, identityNumber: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adı"
                fullWidth
                value={formValues.firstName || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, firstName: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Soyadı"
                fullWidth
                value={formValues.lastName || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, lastName: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-Posta"
                type="email"
                fullWidth
                value={formValues.email || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, email: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon"
                fullWidth
                value={formValues.phoneNumber || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, phoneNumber: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Uzmanlık"
                fullWidth
                value={formValues.specialization || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, specialization: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres"
                fullWidth
                value={formValues.address || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, address: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Doğum Tarihi"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.birthDate || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, birthDate: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Şifre"
                type="password"
                fullWidth
                value={formValues.password || ''}
                onChange={e =>
                  setFormValues(prev => ({ ...prev, password: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={handleAddSave}>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDoctorsPage;
