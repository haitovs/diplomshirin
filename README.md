# Shirin Portfolio Builder 🎓

A comprehensive platform for students to build professional portfolios and for the university to manage and archive diploma works. This application serves two main purposes: empowering students to create resumes/portfolios and maintaining a searchable database of student projects.

## 🌟 Core Functionalities

### 1. Portfolio Builder 🛠️

A client-side tool that allows students to create professional resumes and portfolios without needing to sign up.

- **Features**:
  - **Dynamic Sections**: Manage Personal Info, Skills, Projects, Experience, Education, etc.
  - **Live Preview**: See changes in real-time.
  - **Export to JSON**: Save your progress locally.
  - **Sample Data**: Load a sample portfolio to get started quickly.
- **Access**: Click "Builder" in the navigation menu or "Start Building" on the homepage.

### 2. Diploma Archive & Admin Panel 📚

A centralized database for storing and showcasing final year diploma works. This system is managed via a dedicated Admin Panel.

#### For Students & Public

- **Archive**: Browse approved diploma works, filter by category, year, or student.
- **Submit**: Students can submit their diploma works for review. The submission process collects project details, screenshots, and repository links.

#### For Administrators (Admin Panel)

- **Access**: Click the **"Admin Login"** link in the footer or navigate to `/login`.
- **Credentials**: (Demo) `admin` / `admin123`.
- **Capabilities**:
  - **Dashboard**: View high-level statistics (Total Projects, Views, etc.).
  - **Manage Projects**: Review pending submissions. Approve or Reject works. Edit existing entries.
  - **Manage Students**: View registered students (mock data in this version).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- NPM

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd shirin-portfolio-builder
   ```

2. **Install Dependencies**

   ```bash
   # Install root dependencies (includes concurrent launch script)
   npm install
   
   # Install Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Run the Application**

   ```bash
   # Starts both Frontend (Vite) and Backend (Express)
   ./run.sh
   # OR
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Better-SQLite3
- **Database**: SQLite (file-based)
