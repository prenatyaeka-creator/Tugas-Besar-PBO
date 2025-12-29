# TaskMate Backend (Spring Boot + MySQL/MariaDB)

Backend REST API untuk aplikasi **TaskMate** (team, project, task, diskusi, file).  
Menyesuaikan komponen penilaian: **CRUD, relasi & join, MVC, validation, exception handling, role access (JWT), dan clean structure**.

## Tech Stack
- Java 17+ (disarankan Java 21 / 17; Java 25 bisa jalan tapi muncul warning Tomcat)
- Spring Boot, Spring Web (MVC), Validation
- Spring Data JPA (Hibernate) + MySQL/MariaDB
- Spring Security + JWT
- JUnit (bonus, bila ada)

---

## Cara Menjalankan (tanpa Docker — XAMPP phpMyAdmin)

### 1) Import database
Import file SQL berikut di phpMyAdmin:
- `database/taskmate_mysql_import_clean.sql`

File ini akan membuat database: `db_taskmate` + tabel (tanpa data demo/seed).

### 2) Set environment
Di folder `backend`, copy env example:
```bash
cp .env.xampp.example.sh .env.xampp.sh
```

Edit `.env.xampp.sh` bila perlu:
- Port MySQL (3306/3307)
- Username/password
- Nama database

### 3) Run backend
```bash
source ./.env.xampp.sh
mvn spring-boot:run
```

Backend akan berjalan di:
- `http://localhost:8080`

### 4) Test cepat
- `http://localhost:8080/actuator/health`

---

## Akun

Tidak ada akun demo. Silakan buat akun lewat frontend atau lewat endpoint:

```http
POST /api/auth/register
```

## Forgot Password (OTP via Email)

Fitur reset password menggunakan OTP 6-digit yang dikirim ke email.

### Konfigurasi SMTP (wajib agar OTP benar-benar terkirim)
Set env berikut sebelum menjalankan backend:

```bash
export MAIL_HOST="smtp.gmail.com"   # contoh
export MAIL_PORT="587"
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"  # gunakan App Password untuk Gmail
export MAIL_FROM="TaskMate <your-email@gmail.com>"
```

### Endpoint

1) Request OTP
```http
POST /api/auth/forgot-password
Content-Type: application/json

{"email":"user@example.com"}
```

2) Reset password dengan OTP
```http
POST /api/auth/reset-password
Content-Type: application/json

{"email":"user@example.com","otp":"123456","newPassword":"newStrongPassword"}
```