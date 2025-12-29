# TaskMate — Run on macOS (VSCode) + XAMPP phpMyAdmin

## 1) Prerequisites
- Java 17+
- Node.js 18+
- XAMPP (MySQL + phpMyAdmin)
- VSCode (recommended)

## 2) Import database (phpMyAdmin / XAMPP)
1. Start **MySQL** in XAMPP.
2. Open phpMyAdmin.
3. Import (recommended): `database/taskmate_mysql_import_clean.sql`
   - SQL ini akan **DROP + CREATE database** otomatis (menghindari error FK #1451).
   - Database default yang dibuat: `db_taskmate`
> Untuk XAMPP MariaDB, file env sudah menonaktifkan Flyway (`SPRING_FLYWAY_ENABLED=false`) agar tidak error `Unsupported Database: MySQL 5.5`.

Tidak ada akun demo/seed. Silakan register dari UI.

## 3) Run Backend (Spring Boot)
### Option A (recommended): use env file for XAMPP
1. Edit `backend/.env.xampp.sh` jika MySQL user/pass/port berbeda (contoh XAMPP biasanya user `root`, password kosong).
2. Run:
```bash
./scripts/run-backend.sh
```

Backend runs at: http://localhost:8080

### Option B: set env manually (one terminal session)
```bash
cd backend
export DB_URL="jdbc:mysql://localhost:3307/db_taskmate?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD=""
mvn spring-boot:run
```

> Catatan: di beberapa setup XAMPP, MySQL port-nya `3306`. Jika begitu, ubah `3307` -> `3306`.

## 4) Run Frontend (Vite)
In another terminal:
```bash
./scripts/run-frontend.sh
```
Frontend runs at: http://localhost:3000

## Notes
- Kalau port 3000 bentrok, ganti di `scripts/run-frontend.sh`.
- Kalau kamu pakai Java 25, Lombok harus kompatibel. Project ini sudah dipin ke Lombok `1.18.40`.
- Backend config ada di `backend/src/main/resources/application.yml`.

## Forgot Password (OTP via Email)
Fitur ini ada di backend. Set konfigurasi SMTP (opsional) di `backend/.env.xampp.sh`, lalu gunakan endpoint:
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`