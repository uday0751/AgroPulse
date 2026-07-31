<<<<<<< HEAD
<<<<<<< HEAD
# AgroPulse
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
=======
# E-Farmer Connect Web App
>>>>>>> 446450b (Complete AgroPulse Platform: Marketplace, Mandi Finder, 60-Day Weather Prediction, e-Farmer Verified Community Chat)

A production-grade, highly polished web application designed to empower farmers with real-time crop prices, meteorological forecasting, professional expert advisory, peer-to-peer discussion lounges, and intelligent crop scheduling calculators.

## 🚀 Technology Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS & Vanilla CSS (minimal DeHaat-inspired light/dark themes)
*   **Database/Auth**: Firebase Firestore & Firebase Auth (Google & Phone OTP Login)
*   **Meteorology API**: OpenWeather API
*   **Analytics/Data Vis**: Recharts
*   **Internationalization**: i18next & react-i18next (English, Hindi, Marathi, Punjabi, Tamil, Telugu, Bengali, Gujarati)

---

## 📁 Folder Structure
```text
src/
├── app/
│   ├── auth/            # Phone/Google login flow
│   ├── community/       # Real-time discussion groups (State/Crop-wise)
│   ├── experts/         # Expert consult directory & call placeholder UI
│   ├── market/          # Recharts comparison metrics & Mandi search
│   ├── planner/         # Soil-to-yield estimation calculators
│   ├── profile/         # Farmer demographic cards
│   ├── profile-setup/   # Initial onboarding questionnaire
│   ├── schemes/         # Government subsidy directory & mock applier
│   ├── settings/        # Locale toggles and dark mode togglers
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Providers.tsx    # Context wrappers for locale & state
│   └── Sidebar.tsx      # Navigation panel (conditionally rendered)
└── lib/
    ├── firebase.ts      # Auth & Firestore init configuration
    └── i18n.ts          # Localization dictionaries & setup
```

---

## 🛠️ Setup Instructions

### 1. Configure Environment Variables
Duplicate `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your Firebase credentials and your OpenWeather API key.

### 2. Install Dependencies & Launch
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to view the platform.

---

## 🔒 Firebase Security Rules & Schema Design

### 1. User Profiles Collection (`/users/{uid}`)
```json
{
  "uid": "USER_UNIQUE_ID",
  "fullName": "Rahul Patel",
  "phoneNumber": "+919876543210",
  "email": "rahul@gmail.com",
  "state": "Maharashtra",
  "district": "Pune",
  "primaryCrop": "Wheat",
  "farmSize": "5 Acres",
  "createdAt": "2026-07-12T15:48:00Z"
}
```
**Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

<<<<<<< HEAD
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 01ada91 (Initial commit from Create Next App)
=======
### 2. Group Chats Collection (`/chats/{groupId}/messages/{messageId}`)
```json
{
  "text": "Are whiteflies active in Pune right now?",
  "uid": "USER_UNIQUE_ID",
  "displayName": "Rahul Patel",
  "avatar": "https://images.unsplash.com/.../avatar",
  "createdAt": "SERVER_TIMESTAMP"
}
```
**Firestore Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{groupId}/messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }
  }
}
```
>>>>>>> 446450b (Complete AgroPulse Platform: Marketplace, Mandi Finder, 60-Day Weather Prediction, e-Farmer Verified Community Chat)
