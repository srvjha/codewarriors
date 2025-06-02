# CodeWarriors

CodeWarriors is a comprehensive full-stack web platform for mastering Data Structures & Algorithms (DSA), competitive programming, and coding interview preparation. It offers a rich set of features for both learners and administrators, with a modern, scalable architecture.

---

## Table of Contents

- [Overview](#overview)
- [Applications & Features](#applications--features)
  - [1. User Dashboard](#1-user-dashboard)
  - [2. Problem Solving](#2-problem-solving)
  - [3. Code Editor & Submission](#3-code-editor--submission)
  - [4. Playlists & Progress Tracking](#4-playlists--progress-tracking)
  - [5. Leaderboard & Streaks](#5-leaderboard--streaks)
  - [6. Discussion Forum](#6-discussion-forum)
  - [7. Admin Panel](#7-admin-panel)
  - [8. Authentication & Security](#8-authentication--security)
  - [9. Responsive UI/UX](#9-responsive-uiux)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**CodeWarriors** is designed to help users practice, discuss, and master coding problems in a collaborative environment. It supports real-time code execution, progress analytics, and community engagement, making it ideal for both self-learners and educators.

---

## Applications & Features

### 1. User Dashboard

- Personalized dashboard showing solved problems, streaks, and progress by topic.
- Visual analytics (charts, graphs) for tracking improvement.
- Quick links to playlists, recent activity, and recommended problems.

### 2. Problem Solving

- Large curated library of DSA and algorithmic problems.
- Problems categorized by topic, difficulty, and tags.
- Detailed problem statements with constraints and examples.
- Filter and search functionality.

### 3. Code Editor & Submission

- Monaco-based code editor with syntax highlighting, auto-completion, and multi-language support.
- Run code against sample and custom test cases.
- Submit solutions for evaluation against hidden test cases.
- Instant feedback with detailed error/output messages.
- AI-powered hints and code analysis (via OpenAI API).

### 4. Playlists & Progress Tracking

- Create custom playlists of problems for focused practice.
- Track progress within playlists and overall.
- Bookmark and revisit unsolved or favorite problems.

### 5. Leaderboard & Streaks

- Global and friends leaderboard based on problems solved, speed, and streaks.
- Daily/weekly streak tracking to encourage consistency.

### 6. Discussion Forum

- Threaded discussions for each problem.
- Share solutions, ask questions, and discuss strategies.
- Upvote helpful answers and mark solutions.

### 7. Admin Panel

- Add, edit, or remove problems and test cases.
- Manage users and moderate discussions.
- Analytics dashboard for platform usage and engagement.

### 8. Authentication & Security

- Secure registration, login, and JWT-based authentication.
- Email verification and password reset.
- Role-based access (user/admin).

### 9. Responsive UI/UX

- Modern, accessible, and mobile-friendly design.
- Dark mode support.
- Smooth animations and transitions.

---

## Tech Stack

**Frontend:**

- **React (TypeScript):** Component-based UI library for building interactive interfaces with static typing.
- **Vite:** Lightning-fast build tool and development server for modern web projects.
- **Redux Toolkit:** Simplified state management and async logic handling.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development and theming (including dark mode).
- **Monaco Editor:** Powerful code editor (used in VS Code) for in-browser code editing with syntax highlighting and IntelliSense.
- **Framer Motion:** Declarative animations and transitions for React.
- **React Router:** Client-side routing for seamless navigation.
- **PrismJS:** Syntax highlighting for code blocks and markdown.
- **Lucide Icons:** Open-source icon library for consistent UI icons.

**Backend:**

- **Node.js:** JavaScript runtime for scalable server-side applications.
- **Express.js:** Minimal and flexible Node.js web application framework for RESTful APIs.
- **Prisma ORM:** Type-safe database ORM for PostgreSQL, enabling easy data modeling and migrations.
- **PostgreSQL:** Robust, open-source relational database for storing users, problems, submissions, and discussions.
- **JWT (JSON Web Tokens):** Secure authentication and authorization for API endpoints.
- **OpenAI API:** Integration for AI-powered code hints, explanations, and code review features.
- **Swagger (OpenAPI):** Auto-generated, interactive API documentation for backend endpoints.
- **Winston:** Advanced logging library for error tracking and audit trails.
- **dotenv:** Environment variable management for secure configuration.
- **bcrypt:** Password hashing for secure user authentication.
- **Resend:** Email service for verification, password reset, and notifications.
- **CORS:** Secure cross-origin resource sharing setup for frontend-backend communication.
- **Rate Limiter:** Prevents brute-force attacks and abuse of API endpoints.

---

## Project Structure

```
codewarriors/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── configs/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── generated/
│   │   ├── helper/
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── public/
│   │   └── uploads/
│   ├── logs/
│   └── ...
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── utils/
    │   ├── index.css
    │   └── ...
    ├── public/
    ├── index.html
    └── ...
```

---

## Setup & Installation

### Backend

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in DB, JWT, etc.
3. Setup database:
   ```sh
   npx prisma migrate dev
   ```
4. Start server:
   ```sh
   npm run dev
   ```

### Frontend

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and set API URLs.
3. Start dev server:
   ```sh
   npm run dev
   ```

---

## API Documentation

- Swagger UI:  
  `http://localhost:3000/api-docs` (when backend is running)

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT License

---

**Made with ❤️ by Saurav Jha**
