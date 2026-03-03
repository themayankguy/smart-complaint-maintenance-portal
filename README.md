# Smart Complaint & Maintenance Portal (SCMP)

A premium, role-based enterprise solution for managing facility maintenance and service requests. Built with a high-performance FastAPI backend and a modern, glassmorphism-inspired React frontend.

## 🚀 Key Features

### 👤 User Hub
* **Self-Service**: File new maintenance requests with detailed descriptions.
* **Activity Log**: Track the status of your own submissions (Pending, Assigned, In-Progress, Resolved, Closed).
* **Control**: Cancel or Edit pending requests before they are assigned.

### 🛠 Technician Board
* **Task Board**: Exclusive access to a specialized board showing only assigned tasks.
* **Workflow Management**: Progress tasks from `Assigned` → `In Progress` → `Resolved`.
* **Focus Mode**: Clean, distraction-free interface for field operations.

### 🛡 Admin Command Center
* **Live Analytics**: Real-time monitoring of system health and task distribution.
* **Dispatch Center**: Global log management allowing admins to assign technicians to pending requests.
* **Force Actions**: Ability to close logs or reassign workforce as needed.
* **Team Management**: Centralized hub for controlling platform access levels.

## 🏗 Tech Stack

### Backend
* **Framework**: FastAPI (Python 3.13)
* **Database**: MySQL with SQLAlchemy ORM
* **Security**: JWT Authentication + PBKDF2 Password Hashing
* **Validation**: Pydantic v2

### Frontend
* **Core**: React 18 + Vite
* **Styling**: Tailwind CSS (Premium Glassmorphism Theme)
* **Animations**: Framer Motion (Subtle Enterprise Transitions)
* **Icons**: Lucide React
* **State**: Context API (Auth & Theme)

## 📁 Project Structure

```text
scmp/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── models/     # SQLAlchemy Database Models
│   │   ├── schemas/    # Pydantic Validation Schemas
│   │   ├── routers/    # API Endpoint Definitions
│   │   └── utils/      # Security & Helpers
│   └── main.py         # Entry Point
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Shared UI Components
│   │   ├── pages/      # Role-based View Modules
│   │   ├── services/   # Axios API Client
│   │   └── context/    # Global State Managers
│   └── tailwind.config.js
└── Jenkinsfile         # CI/CD Pipeline Configuration
```

## 🛠 Setup Instructions

### 1. Backend Setup
```bash
cd backend
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Set up environment variables (.env)
python3 setup_env.py
# Initialize database
python3 init_db.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

## 🚦 Running the Site

### Step 1: Start the Backend
```bash
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload
```
*API docs available at: http://localhost:8000/docs*

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```
*App available at: http://localhost:5173*

---

### **Commands to run the site:**

**To start the Backend (from project root):**
```bash
cd backend && ../.venv/bin/python -m uvicorn app.main:app --reload
```

**To start the Frontend (from project root):**
```bash
cd frontend && npm run dev
```
