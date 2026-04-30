# 🗳️ ElectionGuru — Your Vote, Your Voice

An interactive, multilingual Election Education Platform that helps Indian citizens understand the complete election process — from voter registration to result declaration.

![ElectionGuru](https://img.shields.io/badge/ElectionGuru-v1.0-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi)
![Gemini](https://img.shields.io/badge/Gemini_2.5-AI_Powered-4285F4?style=flat-square&logo=google)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🏠 Home Page
- Hero section with India-themed gradient design
- Feature cards linking to all modules
- Live election stats (950M+ voters, 543 Lok Sabha seats, etc.)

### 📅 Election Timeline
- Visual 8-phase timeline from announcement to results
- Phase-by-phase breakdown with pro tips
- Color-coded status (completed, current, upcoming)

### 📖 Step-by-Step Election Guide
- Interactive 5-step wizard with checklists
- Covers: Registration → Nomination → Campaign → Voting → Counting
- Progress tracking with Firebase persistence
- Gamified checklist — complete all items to advance

### 🛡️ Myth Buster
- 8 common election myths with flip-to-reveal facts
- Covers: EVM security, NOTA, online voting, voter ID, postal ballots
- Animated card interactions

### 🤖 AI Election Assistant (Gemini 2.5 Flash)
- Real-time AI chat powered by Google Gemini
- Expert knowledge on Indian election laws, ECI procedures, voter registration
- Conversation history with context-aware responses
- Bilingual support (English & Hindi)
- Quick suggestion chips for common questions

### 📍 Polling Booth Finder
- Interactive Google Maps with dark theme
- Multi-query search (polling booths, govt schools, community halls, collectorate offices)
- Real-time geocoding — search any city in India
- Markers with info windows showing address details
- 10km search radius with up to 12 results

### 🌐 Multilingual Support
- Full English ↔ Hindi toggle
- All pages translated using react-i18next

### 📱 Fully Responsive
- Mobile-first design (390px → 1440px+)
- Hamburger navigation on mobile
- Adaptive layouts for all screen sizes

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + ShadCN UI |
| **Animations** | Framer Motion |
| **AI Backend** | FastAPI (Python) + Google Gemini 2.5 Flash |
| **Maps** | Google Maps JavaScript API + Places API + Geocoding API |
| **Database** | Firebase Firestore (user progress) |
| **Auth** | Firebase Anonymous Authentication |
| **i18n** | react-i18next (English + Hindi) |
| **Routing** | React Router DOM |

---

## 📁 Project Structure

```
ElectionGuru/
├── backend/
│   ├── main.py              # FastAPI server with Gemini AI integration
│   ├── .env.example          # Backend env template
│   └── venv/                 # Python virtual environment (gitignored)
│
├── frontend-app/
│   ├── public/               # Static assets (favicon, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx        # Navigation with mobile hamburger menu
│   │   │   │   └── Footer.tsx        # Site footer
│   │   │   └── ui/                   # ShadCN UI components
│   │   ├── hooks/
│   │   │   └── useUserProgress.ts    # Firebase progress persistence hook
│   │   ├── lib/
│   │   │   ├── firebase.ts           # Firebase config & anonymous auth
│   │   │   ├── i18n/index.ts         # English + Hindi translations
│   │   │   └── utils.ts              # Utility functions
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Landing page with hero & features
│   │   │   ├── TimelinePage.tsx      # 8-phase election timeline
│   │   │   ├── GuidePage.tsx         # Interactive step-by-step wizard
│   │   │   ├── MythsPage.tsx         # Myth vs Fact flip cards
│   │   │   ├── ChatPage.tsx          # AI chat with Gemini
│   │   │   └── BoothPage.tsx         # Google Maps booth finder
│   │   ├── App.tsx                   # Router & dark mode setup
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles & CSS variables
│   ├── .env.example                  # Frontend env template
│   ├── tailwind.config.js            # Tailwind with India-themed colors
│   ├── vite.config.ts                # Vite + API proxy config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **Google Cloud** account (for Maps & Gemini APIs)
- **Firebase** project (optional, for user progress)

### 1. Clone the Repository

```bash
git clone https://github.com/harsh17078/ElectionGuru.git
cd ElectionGuru
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # macOS/Linux

pip install fastapi uvicorn python-dotenv google-genai

# Create .env from template
cp .env.example .env
# Add your Gemini API key to .env
```

### 3. Setup Frontend

```bash
cd frontend-app
npm install

# Create .env from template
cp .env.example .env
# Add your Google Maps API key and Firebase config to .env
```

### 4. Get API Keys

| API Key | Where to Get | Required |
|---------|-------------|----------|
| **Gemini API Key** | [Google AI Studio](https://aistudio.google.com/apikey) | ✅ Yes |
| **Google Maps API Key** | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) | ✅ Yes |
| **Firebase Config** | [Firebase Console](https://console.firebase.google.com) | ⬜ Optional |

**Google Cloud APIs to enable:**
- Maps JavaScript API
- Places API
- Geocoding API

### 5. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
.\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend-app
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`frontend-app/.env`)
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Firebase (optional)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🖼️ Screenshots

| Home Page | Election Timeline | Step-by-Step Guide |
|:---------:|:-----------------:|:------------------:|
| Dark themed hero with India tricolor | 8-phase visual timeline | Interactive wizard with checklists |

| Myth Buster | AI Chat (Gemini) | Booth Finder (Maps) |
|:-----------:|:----------------:|:-------------------:|
| Flip cards with animations | Real-time AI responses | Interactive Google Maps |

---

## 🗺️ Roadmap

- [x] Election Timeline with 8 phases
- [x] Interactive Step-by-Step Guide
- [x] Myth Buster with flip animations
- [x] AI Chat powered by Gemini 2.5 Flash
- [x] Polling Booth Finder with Google Maps
- [x] Multilingual support (EN/HI)
- [x] Firebase user progress persistence
- [x] Mobile responsive design
- [ ] More regional languages (Tamil, Bengali, Marathi)
- [ ] Push notifications for election dates
- [ ] Admin dashboard for content management
- [ ] PWA support for offline access

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Harsh** — [@harsh17078](https://github.com/harsh17078)

---

<p align="center">
  <b>🇮🇳 Empowering citizens through election education 🇮🇳</b>
</p>
