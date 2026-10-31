# 🏛️ Public Grievance AI Assistant
### **Problem ID:** `HACK-P438` | College Hackathon 2026

An AI-driven municipal grievance intake, automated triage, and transparent redressal platform. Built with a clean, modular full-stack architecture tailored for high readability and zero-friction execution.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/srparnithareddy-bit/Public-Grievance-AI)
&nbsp;&nbsp;
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/srparnithareddy-bit/Public-Grievance-AI)

---

## 📌 Executive Summary & Architecture

Citizens often struggle to file complaints because municipal portals require manual categorization across dozens of departmental bylaws and technical departments. This leads to misrouted tickets, delayed responses, and zero transparency.

**Public Grievance AI Assistant** solves this by:
1. **Intelligent Natural Language Intake:** Citizens write complaints in their own everyday words.
2. **Gemini AI Complaint Triage Engine:** Automatically categorizes tickets (`Sanitation`, `Water`, `Roads`, `Electricity`, `Public Safety`, `General`), calculates Urgency (`Low`, `Medium`, `High`, `Critical`), generates executive summaries, and proposes 3 concrete action steps for authorities.
3. **Unique Tracking ID & Real-Time Timeline:** Generates traceable IDs (`GRV-2026-XXXX`) with a visual audit progress bar from submission to resolution.
4. **Administrative Department Queue:** Officials filter incoming tickets by urgency/department, post official resolution remarks, and update status (`Pending` ➔ `In Progress` ➔ `Resolved`).

```
+-----------------------------------------------------------------------------------+
|                                  USER / CITIZEN                                   |
|   - Conversational AI Assistant Modal (Gemini API)                                |
|   - Auto-filled Grievance Form & Location Details                                 |
|   - Real-Time Tracking ID Lookup (GRV-2026-XXXX)                                  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                    HTTP / JSON
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        FRONTEND (React 18 + Vite + Tailwind CSS)                  |
|   - Navbar.jsx: Role indicators, fast-switch demo pills, modal triggers           |
|   - AIChatModal.jsx: Fast triage & conversational assistant                       |
|   - CitizenDashboard.jsx: Personal history, filter tabs, complaint cards          |
|   - AdminDashboard.jsx: Inflow analytics, department pills, queue table           |
|   - StatusTimeline.jsx: Step progress & official audit remarks                    |
|   - GrievanceDetailModal.jsx & AdminUpdateModal.jsx                               |
+-----------------------------------------+-----------------------------------------+
                                          |
                                    REST API Calls
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         BACKEND (Node.js + Express.js REST API)                   |
|   - /routes/auth.js: JWT session management, bcrypt password hashing              |
|   - /routes/grievances.js: Queue queries, submission, status updates, stats       |
|   - /routes/ai.js: Gemini SDK structured prompt parser + heuristic fallback       |
|   - /middleware/auth.js: Role-Based Access Control (RBAC: Citizen vs Official)    |
+------------------------------------+----+-----------------------------------------+
                                     |    |
                   +-----------------+    +-----------------+
                   v                                        v
+-------------------------------------+  +------------------------------------------+
|          DATABASE LAYER             |  |               AI ENGINE                  |
|  - MongoDB using Mongoose ODM       |  |  - Google Gemini API                     |
|  - Auto-Fallback In-Memory Store:   |  |    (@google/generative-ai)               |
|    Instantly runs even without      |  |  - Structured JSON classification        |
|    local MongoDB installed!         |  |  - Smart offline fallback heuristics     |
+-------------------------------------+  +------------------------------------------+
```

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons |
| **Backend** | Node.js (v20+), Express.js (RESTful API architecture) |
| **Database** | MongoDB with Mongoose ODM (includes zero-config in-memory fallback) |
| **AI Integration** | Google Gemini API (`@google/generative-ai` SDK) |
| **Authentication** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), RBAC middleware |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- *(Optional)* MongoDB running locally or a MongoDB Atlas connection string. If MongoDB is not installed, the app automatically runs in **Built-In Demo Mode** with pre-seeded complaints so you can test immediately!

---

### 2. Setup & Installation

Clone or extract the repository, open a terminal in the root project folder, and run:

```bash
# Install backend and frontend dependencies
npm run setup
```

Or install separately:
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

---

### 3. Environment Configuration

Copy `.env.example` into `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

`backend/.env` contents:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/public_grievance_db
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-1.5-flash
JWT_SECRET=hackathon_super_secret_jwt_key_2026
```

> **Note on Gemini API Key:**  
> You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).  
> If you leave `GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE`, our **Intelligent Heuristic Fallback Engine** automatically activates so all AI classification, triage cards, and recommendations run smoothly offline without breaking the demo!

---

### 4. Running the Application

To run both Backend and Frontend concurrently from the root directory:

```bash
npm run dev
```

Alternatively, run them in separate terminal tabs:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server will run on: http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Client will run on: http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Test Credentials (1-Click Fast Track)

For rapid hackathon evaluation, the app includes pre-seeded accounts with **1-Click Quick Login** buttons on the login page:

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Citizen User** | `citizen@demo.com` | `citizen123` | File new complaints, view personal history, track live status |
| **Municipal Admin** | `admin@gov.in` | `admin123` | View all department queues, update status, post resolution remarks |
| **Water Officer** | `water.officer@gov.in` | `admin123` | Jal Board departmental supervisor access |

---

## 📋 Pre-Loaded Sample Grievances (Test Tracking IDs)

You can test real-time tracking by clicking **"Track Grievance"** in the navbar and entering any of these pre-seeded IDs:

| Tracking ID | Category | Urgency | Status | Title Snippet |
| :--- | :--- | :--- | :--- | :--- |
| **`GRV-2026-1001`** | **Water** | Critical | In Progress | Main Pipeline Burst Flooding 4th Cross Road |
| **`GRV-2026-1002`** | **Electricity** | Critical | Pending | Exposed High Voltage Cable Dangling Near Market |
| **`GRV-2026-1003`** | **Roads** | High | **Resolved** | Cluster of Deep Potholes on Main Ring Road Flyover |
| **`GRV-2026-1004`** | **Sanitation** | High | In Progress | Overflowing Municipal Garbage Dumpster Near Primary School |
| **`GRV-2026-1005`** | **Public Safety** | Medium | Pending | Non-Functional Streetlights on Dark Stretch of 2nd Main |

---

## 🤖 AI Complaint Triage Engine Details

The triage engine uses Google Gemini's multimodal reasoning with system instructions enforcing strict structured JSON output:

```json
{
  "title": "Severe Main Pipeline Burst Flooding 4th Cross Road",
  "category": "Water",
  "urgency": "Critical",
  "summary": "Underground drinking water main pipe fractured near the community hall causing roadway flooding.",
  "actionableRecommendations": [
    "Immediately shut down feeder valve at Substation 4B.",
    "Dispatch Jal Board emergency repair crew with suction pumps.",
    "Alert traffic police to divert vehicles away from 4th Cross Road."
  ],
  "confidenceScore": 0.98,
  "detectedKeywords": ["pipe burst", "flooding", "potable water"]
}
```

- **Urgency Assignment Rules:**
  - `Critical`: Live electrical sparks, electrocution risks, flash water flooding, gas leaks, road collapse.
  - `High`: Severe water supply cuts, major flyover potholes, school/hospital vicinity waste.
  - `Medium`: General street light failure, uncollected domestic bin, pavement cracks.
  - `Low`: Aesthetic requests, park tree pruning, long-term civic suggestions.

---

## 📡 REST API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new Citizen account | No |
| `POST` | `/api/auth/login` | Authenticate citizen or admin official | No |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Bearer JWT |
| `GET` | `/api/auth/demo-credentials` | Fetch quick-test hackathon credentials | No |

### Grievances (`/api/grievances`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/grievances` | Fetch queue (filtered by citizen email or admin scope) | Bearer JWT |
| `POST` | `/api/grievances` | Submit new grievance with auto-generated Tracking ID | Optional (Guest or Citizen) |
| `GET` | `/api/grievances/:id` | Fetch full grievance record | Bearer JWT |
| `GET` | `/api/grievances/track/:trackingId` | Public real-time lookup by Tracking ID | No |
| `GET` | `/api/grievances/stats` | Analytics counters & department distributions | No |
| `PATCH` | `/api/grievances/:id/status` | Update status & post official resolution remarks | Bearer JWT (Admin / Official) |

### AI Services (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/triage` | Parse raw citizen text into structured JSON schema | No |
| `POST` | `/api/ai/chat` | Conversational complaint guidance assistant | No |

### System Health
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, DB mode, and Gemini status | No |

---

## 📁 Project Directory Structure

```
Public Grievance AI Assistant/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & in-memory fallback
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js               # Citizen & Official Mongoose schemas
│   │   └── Grievance.js          # Grievance schema with status history
│   ├── routes/
│   │   ├── auth.js               # Authentication REST endpoints
│   │   ├── grievances.js         # Grievance management & tracking
│   │   └── ai.js                 # Gemini AI triage & chat endpoints
│   ├── services/
│   │   ├── aiService.js          # Google Gemini SDK & rule-based classifier
│   │   ├── seedData.js           # Initial demo records & users
│   │   └── store.js              # Dual-mode Mongoose / Memory data provider
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server bootstrap
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatModal.jsx           # Interactive AI triage & chat modal
│   │   │   ├── AdminUpdateModal.jsx      # Official status & remarks form
│   │   │   ├── GrievanceCard.jsx         # Card with status pill, urgency, copy ID
│   │   │   ├── GrievanceDetailModal.jsx  # Detailed record & audit view
│   │   │   ├── Navbar.jsx                # Responsive header with role indicator
│   │   │   ├── NotificationToast.jsx     # Floating alert toast
│   │   │   ├── StatusTimeline.jsx        # Step progress bar & audit trail
│   │   │   └── TrackModal.jsx            # Real-time Tracking ID lookup
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # React user state & JWT storage
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx        # Official queue, filters, metrics
│   │   │   ├── CitizenDashboard.jsx      # Citizen grievance list & tabs
│   │   │   ├── GrievanceSubmitPage.jsx   # Submission form prefilled by AI
│   │   │   ├── LandingPage.jsx           # Public portal hero & stats
│   │   │   ├── LoginPage.jsx             # Dual-tab / 1-click login
│   │   │   └── RegisterPage.jsx          # Citizen account creation
│   │   ├── services/
│   │   │   └── api.js                    # Fetch client for backend REST API
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env.example
├── package.json                          # Root workspace runner
└── README.md
```

---

## 🎯 Code Quality & Student-Friendly Design
- **Readable & Modular:** Logic is separated into clear `/routes`, `/models`, `/services`, and `/components`.
- **Explicit Error Handling:** Clear HTTP responses (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Error`).
- **Zero-Crash Resilience:** Built with graceful fallbacks so judges will never face blank screens or database connection crashes during evaluation.
- **Client-Side Validation:** Validates form inputs, minimum password lengths, and required contact details before submission.

---
**Problem ID:** `HACK-P438` | Built for College Hackathon
