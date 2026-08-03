# HOSTELSYNC Enterprise SaaS Hostel Management ERP

**HOSTELSYNC** is a commercial-grade, multi-tenant capable SaaS Hostel ERP built with **Java 21**, **Spring Boot 3.4.2**, **Spring Security JWT**, **PostgreSQL 17**, **Flyway**, **WebSockets**, **Cloudinary**, and **React 19** + **Vite** + **Tailwind CSS**.

---

## Key Enterprise Features

- **Four Dedicated Role Portals**:
  - **Admin Portal** (`/login/admin`): SaaS Analytics, KPI dashboard, student/parent registration approvals, user status management, parent-student linkage, audit logs.
  - **Warden Portal** (`/login/warden`): Session-based bulk attendance (Morning/Afternoon/Evening), gate pass approval with digital signature, laundry lifecycle, parcel receipt logging, visitor register.
  - **Student Portal** (`/login/student`): Personal hostel status, gate pass application with downloadable PDF receipt & QR code, laundry tracking, parcel arrival notifications with pickup QR, complaint filing with image attachment & 1-5 star service rating.
  - **Parent Portal** (`/login/parent`): Strict ownership isolation allowing parents to monitor **only** their linked ward's attendance, gate pass history, complaints, and parcel alerts.
- **Unified Authentication Service**: All 4 login portals authenticate via `POST /api/auth/login`. The backend issues role-scoped JWTs and routes users to their authorized dashboard.
- **Mandatory Gender & Default Avatar Rule**: Registration requires selecting Gender (`MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`). The backend `DefaultAvatarService` automatically maps professional gender-matched default avatars if no custom photo is uploaded.
- **Automated Absent Notifications**: Marking a student absent automatically fires real-time WebSocket alerts & notifications to both the Student and Parent dashboards.
- **Official Gate Pass PDF Generator**: Approved gate passes generate an official A4 PDF receipt with student details, validity dates, warden digital signature, and an encrypted ZXing QR Code.
- **AI Hostel Virtual Assistant**: Interactive AI Chat Assistant guiding users on hostel rules, room allocation, gate pass status, and emergency contacts.

---

## Tech Stack

### Backend
- **Core**: Java 21 LTS, Spring Boot 3.4.2
- **Security**: Spring Security 6, JWT (jjwt 0.12.6), BCrypt
- **Database**: PostgreSQL 17, Spring Data JPA, Hibernate, Flyway Database Migrations
- **Media & Documents**: Cloudinary HTTP Client, OpenPDF, ZXing QR Code
- **Real-Time & Docs**: Spring WebSockets (STOMP), SpringDoc OpenAPI (Swagger UI)

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS v4, Glassmorphism design tokens
- **State & Data**: Axios with JWT Interceptor, React Query, React Context
- **UI & Motion**: Framer Motion, Lucide Icons, Recharts, React Hot Toast, QRCode React

---

## Database Seed Information

The database schema is managed via Flyway versioned migration scripts (`V1__init_schema.sql` and `V2__seed_data.sql`).

- **Default Admin User**: `admin@hostelsync.com` (Password: `Admin@1234`)
- **Default Warden User**: `warden@hostelsync.com` (Password: `Warden@1234`)

> [!NOTE]
> Demo cards or credentials are **never** displayed on the login interface. Students and Parents register themselves via `/register/student` and `/register/parent` and require Admin approval before logging in.

---

## Getting Started

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432` with a database named `hostelsync`:
```bash
createdb -U postgres hostelsync
```

### 2. Run Backend (Spring Boot 3.5.x / Java 21)
```bash
cd hostelsync-backend
mvn clean spring-boot:run
```
Backend API will start at: `http://localhost:8080`  
Swagger OpenAPI Docs: `http://localhost:8080/swagger-ui.html`

### 3. Run Frontend (React 19 + Vite)
```bash
cd hostelsync-frontend
npm install
npm run dev
```
Frontend Web Application will start at: `http://localhost:3000`

---

## Docker Deployment

To run the complete production environment using Docker Compose:
```bash
docker-compose up --build -d
```
- **PostgreSQL**: `localhost:5432`
- **Backend API**: `localhost:8080`
- **Frontend App**: `localhost:3000`
