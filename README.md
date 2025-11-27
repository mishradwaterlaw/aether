# Aether (GradeVault)

Aether is a privacy-first, secure academic vault designed for students to track their grades, calculate their SGPA in real-time, and forecast the scores needed to achieve their academic goals.

## 🔒 Security & Privacy: Your Data, Your Device

We understand that academic performance is private. **Aether is built with a "Local-First" architecture.**

*   **No Servers:** We do not have a database. We do not store your grades on any cloud server.
*   **Client-Side Encryption:** Your data is encrypted using **AES-256** (Advanced Encryption Standard) *before* it is saved to your browser's local storage.
*   **You Hold the Key:** Your PIN is the decryption key. Without your PIN, the stored data is just a meaningless string of random characters. Even the administrators cannot access your vault.
*   **Identity Protection:** Student USNs are hashed (SHA-256), meaning your actual university ID is never exposed in the code.

## 🚀 Features

*   **Secure Vault:** Initialize your personal vault with a custom PIN.
*   **Real-Time SGPA:** Automatically calculates your SGPA as you enter scores for Internals, Assignments, and Exams.
*   **The Forecaster:** A powerful "What-If" tool. Enter your target SGPA (e.g., 9.0), and Aether will tell you exactly what you need to score in your remaining exams to achieve it.
*   **Visual Dashboard:** Beautiful, dark-mode interface with glassmorphism design.

## 📖 How to Use

### 1. First Time Setup
1.  Search for your name in the student list.
2.  **Verify Identity:** Enter the **last 4 digits** of your USN. This ensures only you can claim your profile.
3.  **Set a PIN:** Choose a secure PIN. Remember this! It is the only way to unlock your data.

### 2. Daily Usage
1.  Select your name and enter your PIN to unlock your vault.
2.  **Enter Scores:** Input your marks for various events (IA1, IA2, Assignment, SEE).
3.  **Check SGPA:** Watch your SGPA update instantly in the top right corner.

### 3. Using the Forecaster
1.  Scroll to the "Forecaster" section.
2.  Enter your **Target SGPA** (e.g., 8.5 or 9.0).
3.  Click **Calculate**.
4.  The app will update the subject cards to show:
    *   **Achieved:** You've already hit the target for this subject.
    *   **Aim: XX:** You need to score XX marks in the remaining events.
    *   **Impossible:** Mathematically impossible to reach the target given current scores (don't worry, try a slightly lower target!).

## 🛠️ Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS & Framer Motion
*   **Security:** Crypto-js (AES-256, SHA-256)

---
*Built with ❤️ for students by.....*
