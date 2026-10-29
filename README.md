# FreelanceHub

FreelanceHub is a full-stack MERN application that connects clients with skilled freelancers. Clients can post projects, freelancers can browse and apply with proposals, and once an application is approved, both parties can collaborate through real-time chat.

## Features

### Client Features
- Post projects with title, description, budget, duration, and required skills
- View and manage applications received from freelancers
- Approve or reject freelancer applications
- Real-time chat with approved freelancers

### Freelancer Features
- Browse and filter open projects
- Submit applications with proposal, rate, and portfolio link
- Track application status (Pending / Approved / Rejected)
- Real-time chat with clients once approved

### Shared Features
- JWT-based authentication with role-based access (Client / Freelancer / Admin)
- Secure password hashing with bcrypt
- Real-time messaging using Socket.io

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, React Toastify, Bootstrap

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt.js, Socket.io

**Architecture:** MVC pattern (Models, Controllers, Routes)

## 📁 Project Structure

<pre>
FreelanceHub/
├── Client/                     # React frontend
│   └── src/
│       ├── api/                # Axios configuration
│       ├── components/         # Reusable components (Navbar, ProtectedRoute)
│       ├── context/            # Auth context for global state
│       └── pages/              # Login, Register, Dashboard, Chat, etc.
│
└── Server/                     # Express backend
    ├── models/                 # Mongoose schemas (User, Project, Application, Chat, Freelancer)
    ├── controllers/            # Business logic
    ├── Routes/                 # API endpoints
    └── middleware/             # JWT auth middleware
</pre>


## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repository
```bash
git clone https://github.com/mansiwagh2006/FreelanceHub-.git
cd FreelanceHub-
```

2. Set up the backend
```bash
cd Server
npm install
```

Create a `.env` file in the `Server` folder with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Start the server:
```bash
npm run dev
```

3. Set up the frontend
```bash
cd ../Client
npm install
npm run dev
```

4. Open `http://localhost:5173` in your browser

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/projects` | Get all open projects |
| POST | `/api/projects` | Create a new project (client only) |
| GET | `/api/projects/my-projects` | Get client's own posted projects |
| POST | `/api/applications` | Submit an application (freelancer only) |
| GET | `/api/applications/:projectId` | Get applications for a project |

## Author

**Mansi Wagh**  
Final-year B.E. student, Artificial Intelligence and Data Science, ICEM Pune  
Project built as part of SkillWallet SmartBridge's Full Stack MERN course
