# GlobeTrotter — AI-Powered Collaborative Travel Planning Platform

GlobeTrotter is a full-stack, AI-enhanced travel planning platform designed to streamline multi-city itinerary building, deterministic budget calculations, public trip sharing, and AI-driven journey generation and optimization.

---

## 🏗️ Architecture

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express 5, Prisma 7, PostgreSQL (Supabase)
- **AI Module:** Gemini AI Provider + Deterministic Mock Provider with Zod validation schemas
- **Auth:** JWT stateless authentication with bcrypt password hashing

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is configured (see .env.example)
npm run start
# For tests:
npm test
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Ensure .env is configured (see .env.example)
npm run dev
# For production build:
npm run build
```

### 3. AI Module
```bash
cd ai
npm test
```
