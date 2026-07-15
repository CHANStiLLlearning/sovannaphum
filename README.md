# Khmer America School (KAS) Web Portal & Management System

Welcome to the **Khmer America School (KAS)** full-stack web application. This project features a modern, responsive public-facing portal for parents, students, and visitors, integrated with a secure administrative dashboard for school administrators to manage school events, faculty members, news announcements, and user inquiries.

---

## 🏗️ Project Architecture

The project is split into two primary components:
1. **Frontend (`/frontend`)**: A React Single Page Application (SPA) built using TypeScript and Vite, styled with Tailwind CSS.
2. **Backend (`/backend`)**: A Node.js and Express REST API that utilizes Prisma ORM to interact with a PostgreSQL database (hosted on Supabase) and handles secure file uploads and email sending.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v3) & Vanilla CSS
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React & React Icons
- **Data Visualization:** Recharts (for administrative metrics)
- **Rich Text Editing:** React Quill New

### Backend
- **Runtime:** Node.js (CommonJS)
- **Web Framework:** Express
- **ORM:** Prisma ORM
- **Database:** PostgreSQL (managed through Supabase)
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS
- **Media Uploads:** Multer with Supabase Storage (fallback to local folder `/public/uploads`)
- **Mailing:** Nodemailer (SMTP host config)

---

## 📂 Directory Structure

```text
kasweb/
├── backend/
│   ├── prisma/             # Prisma Schema and SQLite fallback db
│   │   └── schema.prisma   # Database schema models
│   ├── public/uploads/     # Local uploads fallback directory
│   ├── .env                # Environment configuration
│   ├── package.json        # Backend dependencies & scripts
│   ├── server.js           # Express main server code
│   └── seed.js             # Script to populate initial database records
└── frontend/
    ├── src/
    │   ├── assets/         # Images, logos, and global styles
    │   ├── components/     # Reusable layout and helper UI components
    │   ├── context/        # React Auth Context for managing admin sessions
    │   ├── pages/          # Public-facing views (Home, About, Admissions, etc.)
    │   │   ├── admin/      # Protected Admin Dashboard & Management views
    │   │   ├── admissions/ # Admission process & Teacher pages
    │   │   └── programs/   # School language and educational program pages
    │   ├── config.ts       # Frontend configuration (API Base URL)
    │   └── App.tsx         # Route configuration
    ├── package.json        # Frontend dependencies & scripts
    └── vite.config.ts      # Vite configuration
```

---

## ⚙️ Prerequisites

Before setting up the project, make sure you have:
- [Node.js](https://nodejs.org/) installed (v18+ recommended)
- A PostgreSQL database (e.g., a free database instance on [Supabase](https://supabase.com))
- A Supabase project with a storage bucket named `images` configured to be **public** (optional: falls back to local storage if keys are not provided)

---

## 🚀 Setup & Installation

Follow these steps to run the application locally.

### 1. Clone & Initialize the Repository
```bash
git clone <repository-url>
cd kasweb
```

### 2. Configure the Backend
Navigate to the `backend` folder and create a `.env` file based on your environment details:

```bash
cd backend
```

Create a `.env` file with the following variables:
```env
# Database connection (PostgreSQL URL)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Supabase Storage Integration (Optional)
SUPABASE_URL="https://your-supabase-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Authentication Security
JWT_SECRET="your_jwt_secret_key"

# Email Configuration (Optional - SMTP details for mailing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

#### Install dependencies & setup database:
```bash
# Install packages
npm install

# Generate Prisma Client code
npx prisma generate

# Apply migrations / Push schema to the database
npx prisma db push

# Seed default data (news, events, and admin user)
node seed.js
```

#### Start the backend server:
```bash
# Run in development mode
npm run dev

# Run in production mode
npm start
```
The backend server runs on `http://localhost:5000` by default.

---

### 3. Configure the Frontend
Open a new terminal session, navigate to the `frontend` folder, and configure the application.

```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the frontend development server:
```bash
npm run dev
```
The client application will launch locally at `http://localhost:5173`.

---

## 🔐 Administrative Access

The admin portal is protected and can be accessed at:
🔗 **URL:** `http://localhost:5173/kas-portal-entry`

### Default Credentials (Seeded)
- **Username:** `admin`
- **Password:** `admin123`

*Note: You can update the password or create new admin accounts by updating `backend/seed.js` or directly modifying the `Admin` model records in your database.*

---

## 🌟 Features

### 🌐 Public Pages
- **Interactive Home Page:** Eye-catching sliders, quick announcements, and highlight sections.
- **Academic Programs:** View detailed schedules, descriptions, and structures of English, Chinese, and Khmer curricula.
- **Admission Process:** Guide on how to register new students, explore tuition structures, and meet our teachers.
- **School News & Events:** Read current notices and browse chronological school events.
- **Faculty Directory:** View information about our teachers and academic leadership.
- **Contact & Inquiry Submission:** Fill out form details which instantly syncs to the administrative dashboard.
- **Newsletter Subscription:** Subscribe to receive updates directly in the inbox.

### 🛡️ Admin Portal (`/admin`)
- **Overview Dashboard:** Visual analytics on total messages, subscribers, teachers, and system health status.
- **News Management:** Complete WYSIWYG editor (React Quill) to format, publish, and delete news articles.
- **Events Management:** Schedule new events with dates, locations, descriptions, and banner pictures.
- **Faculty Management:** Manage directory listings of teachers (add, edit roles, subjects, and avatar uploads).
- **Submissions Hub:** Real-time lookup of message submissions and subscription emails with clean dashboard layouts.
