# 🏥 Hastane Yönetim Sistemi

Modern bir React + Spring Boot tabanlı hastane yönetim uygulaması.  
– **Admin**: Doktor ekleme, listeleme, silme, düzenleme  
– **Doktor**: Randevu takibi, onay/iptal, muayene durumu güncelleme  
– **Hasta**: Randevu alma, geçmiş & bekleyen randevular, sağlık geçmişi görüntüleme  

---

## 🚀 Özellikler

- **Kullanıcı Rolleri**  
  - `ADMIN`: /api/admin/** yollarına tam erişim  
  - `DOKTOR`: Kendi randevularını görüntüleme & güncelleme  
  - `HASTA`: Randevu alma, kendi geçmişlerini ve hastalık geçmişini görüntüleme  

- **Kimlik Doğrulama**  
  - JWT tabanlı Spring Security  
  - `GET /api/auth/login` → Bearer token  
  - `GET /api/auth/getIdentityNumber` → Mevcut kullanıcının TC’si  

- **API Katmanı**  
  - Doktor CRUD: `/api/admin/doctors`, `/api/admin/add/doctors`  
  - Hasta CRUD: `/api/patients/**`  
  - Randevu:  
    - Book: `POST /api/appointments/book`  
    - Bekleyen: `GET /api/appointments/my`  
    - Geçmiş: `GET /api/appointments/myPast`  
    - Durum güncelleme: `PUT /api/appointments/updateStatus/{id}`  

- **Ön Yüz**  
  - React (TS) + MUI v5  
  - Admin paneli: Doktor yönetimi  
  - Doktor paneli: Randevu takibi & durum güncelleme  
  - Hasta paneli: Randevu formu, geçmiş & bekleyen randevular, sağlık geçmişi  

---

## 🛠️ Teknolojiler

- **Backend**:  
  - Java 17 / Spring Boot 3  
  - Spring Security (JWT)  
  - Spring Data JPA + MySQL  
- **Frontend**:  
  - React 18 + TypeScript  
  - React Router v6  
  - Material-UI v5  
  - Axios  

---

## 📥 Kurulum

### 1. Ortam Değişkenleri

Projede `.env` veya application-properties kullanıyorsan örnek:

```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hastane
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=VerySecretKey
jwt.expiration=3600000
```
```

cd backend
./mvnw clean package
java -jar target/hastane-0.0.1-SNAPSHOT.jar
API dokümantasyonuna: http://localhost:8080/swagger-ui.html
```
```
cd frontend
npm install
npm start
```
📚 API Kullanımı
Kimlik Doğrulama

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@hastane.com",
  "password": "123456"
}

– Dönen accessToken’ı Authorization: Bearer <token> header’ında kullanın.
```
Admin → Doktor Yönetimi

GET    /api/admin/doctors               # Tüm doktorlar
GET    /api/admin/doctors/{idNo}       # TC’ye göre tek doktor
POST   /api/admin/add/doctors?password=...  
PUT    /api/admin/doctors/{idNo}
DELETE /api/admin/doctors/{idNo}

Hasta → Randevu

POST   /api/appointments/book
GET    /api/appointments/my          # Bekleyen
GET    /api/appointments/myPast      # Geçmiş
GET    /api/patients/myIllnesses     # Hastalık geçmişi

Doktor → Randevu & Profil

GET    /api/doctors/me               # Kendi profili
GET    /api/appointments/mySchedule  # Bugünkü & gelecekteki
PUT    /api/appointments/updateStatus/{id}

🤝 Katkıda Bulunmak
Fork’la

Branch aç (git checkout -b feature/isim)

Commit et (git commit -m 'feat: yeni özellik')

Push et (git push origin feature/isim)

PR aç

📄 Lisans
```
MIT © [Murat Sinmez]
```


