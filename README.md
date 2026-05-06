# EtherAi - Collaborative Project Management

EtherAi is a modern, real-time collaborative project and task management application designed for high-performance teams. It features a sleek dark/light mode interface, role-based access control (RBAC), and live data synchronization using Firebase.

## ✨ Features

- **Real-time Collaboration**: Live task and project updates across all connected clients.
- **Role-Based Access Control**: Admins can manage team members, roles, and project lifecycle; Members can contribute to tasks.
- **Dynamic Dashboard**: Visual overview of team activity and task distribution using Recharts.
- **Theme Customization**: Seamlessly toggle between polished Dark and Light modes.
- **Project Directory**: High-level view of all active team projects with progress tracking.
- **Task Management**: Create, assign, and track tasks with status and priority levels.
- **Team Management**: Directory of all team members with administrative controls for user roles.

## 🛠️ Tech Stack

- **Frontend**: React (v19), Vite, TypeScript.
- **Styling**: Tailwind CSS, Framer Motion for animations.
- **Icons**: Lucide React.
- **Backend/DB**: Firebase (Authentication & Firestore).
- **Visualization**: Recharts.
- **Server**: Express (for Vite middleware and production serving).

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project (for the database and authentication)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd etherai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a `firebase-applet-config.json` file in the root directory (or use your existing configuration):

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "firestoreDatabaseId": "(default)"
}
```

### 4. Environment Variables

Create a `.env` file for any server-side environment variables if needed (e.g., Gemini API keys):

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Running the Application

For development:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 6. Building for Production

```bash
npm run build
npm start
```

## 🔐 Security Rules

The project uses hardened Firestore security rules to protect user data. Ensure you deploy the `firestore.rules` file to your Firebase console for a secure production environment.

---

Built with ❤️ by SReeJAL.
