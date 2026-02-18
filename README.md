# ScholasticOS 2.0: Institutional Intelligence Platform
### *The Premium Operating System for Modern Academic Orchestration*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github)](https://github.com/yusufdupsc1/schols) [![Framework](https://img.shields.io/badge/framework-next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![Database](https://img.shields.io/badge/database-prisma-blue?style=flat-square&logo=prisma)](https://prisma.io)

> **"Data is the foundation; Intelligence is the destination."**
> 
> *ScholasticOS 2.0* is an advanced Resource Planning (ARP) platform that transforms raw school data into actionable institutional intelligence. Synthesizing complex financial, administrative, and academic vertical records into a premium, "Editorial-grade" experience.

---

## 💎 Scholastic 2.0: The Aesthetic Overhaul

ScholasticOS has been fully refactored to meet "Showcase Grade" standards, moving beyond traditional enterprise UI into a modern, cinematic, and information-dense experience.

### **✨ Design System Pillars**
*   **Bento Grid Architecture:** A dynamic, multi-column layout that prioritizes high-impact KPIs and institutional health "at a glance."
*   **Glassmorphism & Depth:** Leveraging Backdrop Blur, 1px saturation borders, and subtle glow effects for a high-end, floating layer aesthetic.
*   **Editorial Typography:** Pairing the precision of **Plus Jakarta Sans** (Headings) with **Inter** (UI) to create a sophisticated, tech-forward brand identity.
*   **Motion Orchestration:** Powered by `Framer Motion`, the UI features entrance stagger effects, cinematic transitions, and micro-interactive hover states.

---

## ⚡️ Key Features & Engineering Highlights

### **1. 📊 Executive Intelligence Dashboard**
*   **Problem:** Traditional school software provides static, paginated lists that hide institutional health.
*   **Solution:** A custom-built **Bento Grid Dashboard** that synthesizes Revenue, Attendance, and System Integrity records in real-time.
*   **RCC/RSC Pattern:** Uses Server Components for data fetching and Client Components for cinematic motion orchestration.

### **2. 🏢 Enterprise Multi-Tenancy**
*   **Data Isolation:** Implemented strict Row-Level Security patterns. Every query is scoped via a tenant-context provider, ensuring 100% isolation across Institutions.
*   **Result:** Secure, single-tenant feel within a scalable multi-tenant infrastructure.

### **3. 🛡 Identity & Security Protocol**
*   **Cinematic Access Flow:** A redesigned, encrypted-style login experience that reinforces security trust through visual cues and "Shield" status monitoring.
*   **ACID Integrity:** Critical onboarding flows (Student/Employee registration) use `prisma.$transaction` to guarantee zero orphaned records.

### **4. 💰 Financial Ledger Precision**
*   **Double-Entry Principles:** Fee payments are immutable transaction records. Supported by partial payment logic and real-time "Yield Monitoring" tools.
*   **Strategy:** Automated revenue synthesis and projection tools built into the core dashboard.

---

## 🛠 Technology Stack

*   **Frontend:** `Next.js 14 (App Router)`, `Tailwind CSS`, `Framer Motion` (Motion Engine), `Lucide React` (Iconography).
*   **Aesthetics:** Custom Premium Glass Design System, HSL-tailored Color Palette.
*   **Persistence:** `Prisma ORM` (PostgreSQL/SQLite), Typesafe Data Access Layer.
*   **Security:** `NextAuth.js`, custom Middleware verification, Zods Validation.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm / pnpm

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yusufdupsc1/school-management-system.git
    cd school-management-system
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    ```bash
    cp .env.example .env
    ```

4.  **Database Migration & Seeding**
    Initialize the local database and populate with v2.0 mock data:
    ```bash
    npm run db:reset
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

6.  **Run Auth Smoke Test**
    In another terminal (while dev server is running):
    ```bash
    npm run test:smoke:auth
    ```

### Local Access (Mock Credentials)

- **Email:** `admin@eskooly.com`
- **Password:** `admin123`

> In development, if no users exist, logging in with the demo credentials will bootstrap the first admin user.

---

## 🏗 System Architecture

For a detailed breakdown of the "Editorial Developer" aesthetic implementation, RSC optimization, and RFCs, refer to [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md).

---

Built with ❤️ as a demonstration of **Apex Full-Stack Engineering** and **Premium UI/UX Design**.
