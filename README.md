# ScholasticOS: Enterprise Education Management Platform
### *An Intelligent Operating System for Academic Institutions*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github)](https://github.com/yusufdupsc1/schols) [![Framework](https://img.shields.io/badge/framework-next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![Database](https://img.shields.io/badge/database-prisma-blue?style=flat-square&logo=prisma)](https://prisma.io)

> **"Data is the foundation of education management."**
> 
> *ScholasticOS* is a full-stack financial, administrative, and academic resource planning (ARP) platform designed to eliminate the complexity of running a modern educational institution. It is not just a CRUD application; it is a networked system of critical records (fees, exams, attendance, assets).

---

## ⚡️ Key Features & Engineering Highlights

### **1. 📊 Real-Time Institutional Analytics**
*   **Problem:** Traditional school software provides static, paginated lists.
*   **Solution:** Uses **Server-Client Component Composition** to render instant, aggregated data (Total Revenue, Daily Attendance, Grade Averages) without waterfall requests.
*   **Tech Stack:** `Next.js App Router (RSC)`, `Prisma Aggregate Queries`.

### **2. 🏢 Multi-Tenant Architecture**
*   **Problem:** SaaS platforms need to serve multiple schools with strict data isolation.
*   **Solution:** Implemented **Row-Level Security Patterns** via `schoolId` scoping on all queries. Every API route verifies tenant context before execution.
*   **Result:** Complete data isolation for `Student`, `Employee`, `FeeStructure`, and `AcademicYear` models.

### **3. ⚛️ Atomic Transactions (ACID)**
*   **Problem:** Creating a user without a profile (or vice versa) leads to orphaned records and corrupted state.
*   **Solution:** leveraged `prisma.$transaction` ensures that `User` accounts and their corresponding `Student`/`Employee` profiles are created atomically. If one fails, the entire operation rolls back.
*   **Result:** 100% data integrity for critical onboarding flows.


### **4. 💰 Financial Ledger Integrity**
*   **Problem:** Fee Management requires absolute precision (no duplicate receipts, correct partial payments).
*   **Solution:** Modeled around **Double-Entry Bookkeeping Principles**. Payments are immutable transaction records linked to `FeeStructures`.
*   **Result:** Audit-ready financial trails, supporting partial payments, due dates, and varying fee types (Tuition, Lab, Transport).

### **5. 🗓 Temporal Conflict Resolution**
*   **Problem:** Preventing teacher/room double-booking in timetables.
*   **Solution:** The data schema enforces unique constraints on `(Teacher, Day, TimeSlot)` and `(Room, Day, TimeSlot)` tuples.
*   **Result:** Impossible to schedule conflicting classes at the database level.

### **6. 🛡 Enterprise-Grade Security**
*   **Middleware-Protected Routes:** Custom `Next.js Middleware` intercepts all `/dashboard` and `/api` requests to ensure session validity at the edge.
*   **Zod Schema Validation:** Shared validation logic between Client Forms (`react-hook-form`) and Server Actions (`API Routes`) eliminates payload discrepancies.
*   **Type Safety:** End-to-end `TypeScript` integration ensures compile-time safety for all data mutations.

---

## 🛠 Technology Stack

*   **Frontend:** `React 18`, `Next.js 14 (App Router)`, `Tailwind CSS`, `Framer Motion` (for micro-interactions).
*   **Backend:** `Next.js API Routes`, `Server Actions` (for mutations).
*   **Database:** `SQLite` (Development), `PostgreSQL` (Production Ready), `Prisma ORM` (v5+).
*   **Validation:** `Zod`, `React Hook Form`.
*   **Design System:** Custom `shadcn/ui`-inspired component library with a focus on accessibility and dense information hierarchy.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm / yarn / pnpm

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
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    ```

4.  **Database Migration & Seeding**
    Initialize the database and populate it with realistic mock data:
    ```bash
    npm run db:reset
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏗 Architecture Documentation

For a detailed breakdown of the system architecture, design patterns, and RFCs, please refer to [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

> Built with ❤️ by **[Your Name/Handle]** as a demonstration of high-performance full-stack engineering.
