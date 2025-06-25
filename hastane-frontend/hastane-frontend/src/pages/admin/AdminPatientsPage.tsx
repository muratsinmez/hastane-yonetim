// src/pages/admin/AdminPatientsPage.tsx

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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

interface Patient {
  identityNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  // Diğer alanlar varsa ekle
}

const AdminPatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchId, setSearchId] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Partial<Patient>>({});

  // Tüm hastaları getir
  const fetchAllPatients = async () => {
    try {
      const res = await axios.get<Patient[]>('http://localhost:8080/api/admin/patients');
      setPatients(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Hastalar listelenirken hata oluştu.');
    }
  };

  // Kimlik numarasına göre arama
  const fetchPatientById = async () => {
    if (searchId.trim() === '') {
      setError('Önce bir TC kimlik girin.');
      return;
    }
    try {
      const res = await axios.get<Patient>(`http://localhost:8080/api/admin/patients/${searchId}`);
      setPatients([res.data]); // yalnızca bu hastayı listele
    } catch (err: any) {
      console.error(err);
      setError('Hasta bulunamadı veya hata oluştu.');
    }
  };

  // Hasta silme
  const deletePatient = async (identityNumber: string) => {
    if (!window.confirm(`${identityNumber} kimlikli hastayı silmek istediğinize emin misiniz?`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/patients/${identityNumber}`);
      // Silindikten sonra listeden çıkar
      setPatients((prev) => prev.filter((p) => p.identityNumber !== identityNumber));
    } catch (err: any) {
      console.error(err);
      setError('Hasta silinirken hata oluştu.');
    }
  };

  // Düzenleme formunu aç
  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormValues({ ...patient });
    setIsEditDialogOpen(true);
    setError(null);
  };

  // Düzenleme kaydetme
  const handleEditSave = async () => {
    if (!selectedPatient) return;
    const idNo = selectedPatient.identityNumber;
    try {
      await axios.put(
        `http://localhost:8080/api/admin/patients/${idNo}`,
        formValues
      );
      // Başarılı ise listeyi yenile veya güncelle
      setPatients((prev) =>
        prev.map((p) =>
          p.identityNumber === idNo ? { ...(p as Patient), ...(formValues as Patient) } : p
        )
      );
      setIsEditDialogOpen(false);
      setSelectedPatient(null);
      setFormValues({});
    } catch (err: any) {
      console.error(err);
      setError('Hasta güncellenirken hata oluştu.');
    }
  };

  // Yeni hasta ekleme (dialog aç)
  const openAddDialog = () => {
    setFormValues({});
    setIsAddDialogOpen(true);
    setError(null);
  };

  // Yeni hasta ekleme kaydet
  const handleAddSave = async () => {
    // Zorunlu alanları kontrol et (örnek: identityNumber, firstName, lastName, email vs.)
    if (
      !formValues.identityNumber ||
      !formValues.firstName ||
      !formValues.lastName ||
      !formValues.email
    ) {
      setError('Kimlik, ad, soyad ve e-posta zorunlu.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/admin/add/patients', formValues);
      // Başarılı ise listeyi yenile
      fetchAllPatients();
      setIsAddDialogOpen(false);
      setFormValues({});
    } catch (err: any) {
      console.error(err);
      setError('Yeni hasta eklenirken hata oluştu.');
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hasta Yönetimi
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="TC Kimlik No ile Ara"
            fullWidth
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setError(null);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button variant="outlined" onClick={fetchPatientById} fullWidth>
            Ara
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} textAlign="right">
          <Button variant="contained" onClick={openAddDialog}>
            Yeni Hasta Ekle
          </Button>
          <Button
            variant="text"
            onClick={fetchAllPatients}
            sx={{ ml: 2 }}
          >
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
              <TableCell>Telefon</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.identityNumber}>
                <TableCell>{p.identityNumber}</TableCell>
                <TableCell>{p.firstName}</TableCell>
                <TableCell>{p.lastName}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => openEditDialog(p)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deletePatient(p.identityNumber)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Kayıtlı hasta bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Düzenleme Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} fullWidth>
        <DialogTitle>Hasta Bilgilerini Düzenle</DialogTitle>
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
                onChange={(e) => setFormValues(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Soyadı"
                fullWidth
                value={formValues.lastName || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-Posta"
                type="email"
                fullWidth
                value={formValues.email || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon"
                fullWidth
                value={formValues.phone || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres"
                fullWidth
                value={formValues.address || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Doğum Tarihi"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.birthDate || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cinsiyet"
                fullWidth
                value={formValues.gender || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, gender: e.target.value }))}
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

      {/* Yeni Hasta Ekleme Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth>
        <DialogTitle>Yeni Hasta Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="TC Kimlik No"
                fullWidth
                value={formValues.identityNumber || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, identityNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adı"
                fullWidth
                value={formValues.firstName || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Soyadı"
                fullWidth
                value={formValues.lastName || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-Posta"
                type="email"
                fullWidth
                value={formValues.email || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefon"
                fullWidth
                value={formValues.phone || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres"
                fullWidth
                value={formValues.address || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Doğum Tarihi"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formValues.birthDate || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, birthDate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cinsiyet"
                fullWidth
                value={formValues.gender || ''}
                onChange={(e) => setFormValues(prev => ({ ...prev, gender: e.target.value }))}
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

export default AdminPatientsPage;
