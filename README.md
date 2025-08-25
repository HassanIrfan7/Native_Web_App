# Video Sharing Platform

A scalable, cloud-native video sharing web application inspired by platforms like TikTok. The platform enables content creators to upload and manage videos while providing viewers with a seamless browsing and interaction experience. Built with **React** for the frontend and **Node.js** for the backend, the project is designed for deployment on **Microsoft Azure**.

---

## Author
**Hassan Irfan**

---

## Features

- **User Management**
  - Creator accounts with secure signup and login.
  - Profile management for creators.
  - Authentication and authorization using modern standards.

- **Video Upload and Management**
  - Upload videos with metadata (Title, Publisher, Tags, Description).
  - Streamlined dashboard for creators to manage uploaded content.
  - Video preview and deletion options.

- **Video Browsing**
  - Infinite scroll video feed similar to TikTok.
  - Like, comment, and share functionalities.
  - Search and filter videos by tags, title, or publisher.

- **Cloud-Native Design**
  - Scalable backend services.
  - Cloud-based video storage.
  - Efficient delivery via Azure deployment.

---

## Project Structure

# Project Structure

```plaintext
azure-video-platform/
├── client/                     # Frontend (Vite + React)
│   ├── public/                 # Static assets
│   ├── src/                    # Source code
│   │   ├── assets/             # Images, logos, etc.
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API calls
│   │   ├── App.jsx             # Root React component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
├── server/                     # Backend (Node.js + Express)
│   ├── controllers/            # Route handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication, logging, etc.
│   ├── utils/                  # Helper functions
│   ├── config/                 # Config (db, cloud, etc.)
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
│
├── database/                   # Database schema and migrations
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
├── docs/                       # Documentation
│   ├── README.md
│   └── API.md
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignored files
├── package.json                # Root config if using monorepo
├── README.md                   # Project README
└── LICENSE                     # License file


## Tech Stack

- **Frontend:** React, JavaScript, HTML5, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or Azure Cosmos DB)
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Microsoft Azure (App Services, Blob Storage, Cosmos DB)
- **Version Control:** Git + GitHub
