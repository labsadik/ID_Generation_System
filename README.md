
# 🏫 School ID Card Generation System (UID Authority)

A full-stack web application for generating professional School ID cards. This system allows administrators to register students, upload documents, generate a unique 12-digit UID (similar to Aadhaar), and produce a downloadable PDF ID card. It also features a QR code verification system for instant identity validation.

![Project Banner](https://img.shields.io/badge/Stack-MERN-yellowgreen) ![License](https://img.shields.io/badge/License-MIT-blue)


---

## ✨ Features

*   **Step-by-Step Registration**: User-friendly multi-step form for data entry.
*   **Document Management**: Upload Photo, Signature, and Extra Documents (PDF/Image) with live preview.
*   **Unique ID Generation**: Automatically generates a collision-free 12-digit UID (Format: `XXXX XXXX XXXX`).
*   **Professional PDF Card**: Generates a downloadable School ID Card (Front & Back) with a Yellow/Black professional theme.
*   **QR Code Verification**: Every card contains a QR code. Scanning it opens a public profile verification page.
*   **Search & Sidebar**: Real-time search by UID and a sidebar listing all registered students.
*   **Responsive Design**: Fully responsive UI built with Tailwind CSS.

---

## 🛠 Tech Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS
*   Axios
*   React Router DOM

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (Mongoose)
*   Multer (File Uploads)
*   PDFKit (PDF Generation)
*   QR-Image (QR Generation)

---

## 🛡️ Security Implementations

This project implements several security best practices:

1.  **File Type Validation**: 
    *   Strict `fileFilter` ensures only `jpeg`, `jpg`, `png`, and `pdf` files are accepted.
    *   Prevents malicious scripts (like `.exe` or `.sh`) from being uploaded.
2.  **File Size Limit**: 
    *   Multer limits file size to **5MB** to prevent Denial of Service (DoS) attacks via large file uploads.
3.  **Filename Sanitization**: 
    *   Uploaded files are renamed with timestamps and special characters are removed to prevent **Directory Traversal** attacks.
4.  **NoSQL Injection Prevention**: 
    *   Input sanitization using `escapeRegex` for search queries prevents malicious regex patterns.
5.  **Unique UID Guarantee**: 
    *   A `while` loop checks the database before saving to ensure no two users share the same UID.
6.  **Environment Variables**: 
    *   Sensitive configuration (MongoDB URI, Ports) is stored in `.env` files, excluded from version control.

---

## 📁 Project Structure

```text
project-root/
├── server/
│   ├── models/
│   │   └── User.js          # Mongoose Schema
│   ├── routes/
│   │   └── api.js           # API Routes (Register, Search, Download)
│   ├── uploads/             # Uploaded Files Storage
│   ├── .env                 # Server Environment Variables
│   └── server.js            # Server Entry Point
└── client/
    ├── src/
    │   ├── components/      # Reusable Components (Forms, Sidebar, Modal)
    │   ├── pages/           # Pages (Home, Verify)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                 # Client Environment Variables
    └── package.json
```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
*   Node.js installed
*   MongoDB installed (local or Atlas)

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd project-root
```

### 2. Setup Backend (Server)
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_id_system
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
# or
npm start
```

### 3. Setup Frontend (Client)
Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder (if needed):
```env
VITE_API_URL=http://localhost:5000
```

Start the client:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to: `http://localhost:5173`

---

## ⚙️ Environment Variables

| Variable Name | Location | Description |
| :--- | :--- | :--- |
| `PORT` | Server | Port for the backend server (default: 5000) |
| `MONGO_URI` | Server | Connection string for MongoDB |
| `CLIENT_URL` | Server | URL of the frontend app (used for CORS & QR Links) |

---

## 📘 Usage Guide

### 1. Registration
1.  Fill in **Personal Details** (Name, Father's Name, Age, etc.) and click **Next**.
2.  Upload **Photo** and **Signature**. You can optionally upload an **Extra Document** (PDF/Image).
3.  Click **Generate ID**.
4.  You will receive a **12-digit UID**.

### 2. Downloading ID Card
*   After registration, click **Download PDF**.
*   The PDF contains two cards (Front & Back) side-by-side on an A4 page.
*   **Front Side**: Photo, Name, Father's Name, UID, Signature.
*   **Back Side**: Address, Contact, Mother's Name, QR Code.

### 3. Verification
*   **Method 1**: Use the **Search Bar** on the homepage to enter a UID.
*   **Method 2**: Scan the **QR Code** on the printed ID card using any QR scanner app.
*   This opens a verification page showing the user's full profile and documents.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

### Created with ❤️ using MERN Stack
```