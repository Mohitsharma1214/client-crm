# 🎙️ Client CRM — Enterprise Client Acquisition OS & Demo Hub

An enterprise-grade client acquisition pipeline, 24/7 AI Receptionist demo hub, and outreach command center built for high-ticket service practices (dentistry, dermatology, aesthetic clinics, plastic surgery, and luxury architecture).

---

## 🌟 Key Features

- **📊 Command Center Dashboard**: Editorial Anthropic warm-ivory design system with dark/light mode, real-time KPI metrics, and conversion rates.
- **⚡ 1-Click WhatsApp Blast Dispatcher**: Sequential dispatch sequence with pre-filled, customized outreach pitches tailored by business niche.
- **📋 Dual Workspaces (Table & Drag-and-Drop Kanban)**: Instant view toggling between tabular data and swipeable, tactile Kanban columns.
- **📱 100% Mobile & Tablet Optimized**: Pixel-perfect responsive card view across all viewports (320px up to 1440px+) verified with Playwright tests.
- **⏰ Smart Follow-Up Workspace**: Intelligent classification of overdue, due today, and upcoming follow-ups with tailored 2nd-touch WhatsApp follow-up copy.
- **📍 Smart Google Maps / Visiting Card Parser**: Paste raw listing text to automatically extract doctor names, clean phone numbers, websites, and categorize pain points.
- **🗄️ Neon PostgreSQL & Lakebase Sync**: Auto-detects Neon cloud database with zero-latency failover to local JSON storage.
- **⚛️ Standalone React 18 + TypeScript App**: Includes a complete, independent Vite + React + TypeScript codebase in `voice-ai-crm-react/` that can be run standalone or downloaded directly as a ZIP archive.

---

## 📁 Repository Structure

```
.
├── app.py                     # FastAPI / Starlette backend & API endpoints
├── db.py                      # Neon PostgreSQL connection pool & migrations
├── build.js                   # Neon service build & config verifier
├── neon.ts                    # Neon services declaration (AI Gateway, Realtime)
├── requirements.txt           # Python backend dependencies
├── package.json               # Node.js service declarations
├── vercel.json                # Vercel deployment configuration
├── data/
│   └── prospects.json         # 32 verified high-ticket Gurugram / NCR prospects
├── demo-site/                 # Client-facing interactive clinic demo
├── static/
│   ├── index.html             # Command Center Dashboard UI
│   ├── clinic_demo.html       # Clinic demo simulation page
│   └── voice-ai-crm-react.zip # Pre-packaged React app archive
└── voice-ai-crm-react/        # Standalone React 18 + TypeScript + Vite project
    ├── src/
    │   ├── components/        # Fully typed modular React UI components
    │   ├── data/              # Preloaded prospect records
    │   ├── types/             # TypeScript interfaces for CRM entities
    │   └── utils/             # Analytics and WhatsApp deep-link generators
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🚀 Quick Start

### 1. Python Backend & Live Dashboard
```bash
# Clone the repository
git clone https://github.com/Mohitsharma1214/client-crm.git
cd client-crm

# Create virtual environment & install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Neon DATABASE_URL (optional - falls back to local JSON)

# Run server
python3 app.py
```
Open **`http://localhost:8000`** in your browser.

---

### 2. Standalone React + TypeScript App
```bash
cd voice-ai-crm-react
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

