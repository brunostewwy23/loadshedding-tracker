⚡ Load Shedding Tracker

A full-stack web application for tracking and monitoring load shedding schedules. Built with modern web technologies to provide real-time insights into power outages and scheduled maintenance.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Load Shedding Tracker helps users stay informed about scheduled power outages. The application fetches real-time load shedding data and displays it in an intuitive, user-friendly interface.

**Key Features:**
- Real-time load shedding schedule tracking
- Location-based power outage information
- Responsive web interface
- RESTful API backend
- Data caching for optimal performance

## 🛠 Tech Stack

**Frontend:**
- React 18.2.0 - UI library
- Vite 4.0.0 - Build tool & dev server
- Axios - HTTP client

**Backend:**
- Node.js + Express.js - Server framework
- SQLite3 - Database
- CORS - Cross-origin resource sharing
- Axios - HTTP client for external APIs
- Node-cache - In-memory caching

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brunostewwy23/loadshedding-tracker.git
cd loadshedding-tracker
Install dependencies:
bash
npm run build
Start the application:
bash
npm start
The backend will run on http://localhost:3000 and the frontend will be accessible accordingly.

📁 Project Structure
Code
loadshedding-tracker/
├── backend/              # Express.js server
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   ├── index.html
│   └── package.json
├── package.json         # Root package configuration
└── README.md           # This file
📝 Available Scripts
Root Level
npm start - Start the backend server
npm run build - Install all dependencies and build the project
Backend
npm start - Run the Express server
Frontend
npm start - Start Vite development server
npm run build - Build the production bundle
📦 Dependencies
Backend Dependencies
express (^4.18.2) - Web framework
cors (^2.8.5) - CORS middleware
axios (^1.6.0) - HTTP client
node-cache (^5.1.2) - Caching solution
Frontend Dependencies
react (^18.2.0) - UI library
react-dom (^18.2.0) - React DOM rendering
axios (^1.6.0) - HTTP client
Development Dependencies
vite (^4.0.0) - Build tool
@vitejs/plugin-react (^4.0.0) - React plugin for Vite
🤝 Contributing
Contributions are welcome! Feel free to:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details
