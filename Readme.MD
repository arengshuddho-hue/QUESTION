<div align="center">

<img src="assets/images/Favicon.png" alt="CSE-57 Logo" width="90" />

# CSE-57 Section C — Academic Portal

**A real-time, dark-themed academic resource hub for Batch 57, Section C — Dept. of CSE**

[![Live Demo](https://img.shields.io/badge/demo-live-2ea44f?style=for-the-badge)](https://cse57c-portal.vercel.app)
[![Status](https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

**[🌐 Live Site](https://cse57c-portal.vercel.app)** · **[🐛 Report Bug](https://github.com/arengshuddho-hue/cse57c-portal/issues)** · **[✨ Request Feature](https://github.com/arengshuddho-hue/cse57c-portal/issues)**

</div>

<br>

## 📖 Overview

| | |
|---|---|
| **Purpose** | Central hub for Section C students — routines, notes, PQs, faculty info, and links in one place |
| **Audience** | CSE-57, Section C students and faculty |
| **Status** | Actively maintained |
| **Maintainer** | [Shuddha](https://github.com/arengshuddho-hue) |
| **Deployment** | [Vercel](https://cse57c-portal.vercel.app) |

Replaces scattered Facebook posts and Messenger file-drops with a single searchable, always-updated portal.

<br>

## ✨ Features

| Feature | Description |
|---|---|
| 🔥 Real-time sync | Firebase Realtime Database — changes reflect instantly for every visitor |
| 🌗 Theme toggle | Light / dark mode with saved preference |
| ⚡ Command search | `Ctrl/⌘ + K` instant search palette across all resources |
| 📱 Responsive UI | Mobile hamburger menu, touch-optimized cards |
| 🗂️ Quick Menu | Sidebar shortcut to any resource or subject |
| 📢 Live ticker | Scrolling announcements and notices |
| ⏳ Exam countdown | Notice board with live day counter |
| 🍅 Pomodoro timer | Built-in focus/study timer |
| ☁️ File uploads | Google Form → Cloudinary → resource cards |
| 🔐 Admin dashboard | Secure panel to manage all content |

<br>

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (ES Modules) | Core UI and interactivity |
| Database | Firebase Realtime Database | Live resource and notice data |
| File Storage | Cloudinary | Uploaded document hosting |
| Hosting | Vercel | Production deployment |
| Icons | Font Awesome 6 | UI iconography |
| Fonts | Inter, JetBrains Mono | Typography |

<br>

## 📸 Screenshots

<div align="center">
  <img src="assets/images/portal%20s1.png" width="30%" alt="Home Page" />
  <img src="assets/images/portal%20s2.png" width="30%" alt="Resource Modal" />
  <img src="assets/images/portal%20s3.png" width="30%" alt="Admin Dashboard" />
</div>

<p align="center"><sub>Home · Resource Modal · Admin Dashboard</sub></p>

<br>

## 📂 Project Structure

| Path | Description |
|---|---|
| `assets/css/` | Stylesheets |
| `assets/js/main.js` | Firebase logic and UI interactions |
| `assets/images/` | Favicon, banners, icons |
| `index.html` | Main portal page |
| `admin.html` | Admin dashboard |
| `upload.html` | File submission page |
| `README.md` | Project documentation |

<br>

## 🚀 Getting Started

**1. Clone the repository**

\`\`\`bash
git clone https://github.com/arengshuddho-hue/cse57c-portal.git
cd cse57c-portal
\`\`\`

**2. No build step required** — open \`index.html\` directly, or serve locally:

\`\`\`bash
npx serve .
\`\`\`

**3. Connect your own Firebase project** — add your config in \`assets/js/main.js\`:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};
\`\`\`

<br>

## 🗺️ Roadmap

| Status | Feature |
|---|---|
| 🔲 Planned | Daily visitor heatmap (admin analytics) |
| 🔲 Planned | PWA support for offline access |
| 🔲 Planned | Push notifications for new notices |
| ✅ Done | Firebase-backed resource cards |
| ✅ Done | Light/dark theme |
| ✅ Done | Command search palette |

<br>

## 🤝 Contributing

| Step | Action |
|---|---|
| 1 | Fork the repository |
| 2 | Create a feature branch (\`git checkout -b feature/x\`) |
| 3 | Commit your changes |
| 4 | Open a pull request |

Bug reports and suggestions are welcome via [Issues](https://github.com/arengshuddho-hue/cse57c-portal/issues).

<br>

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

You're free to use, copy, modify, and distribute this project, including for your own section or batch, as long as the original copyright notice is kept.

<br>

<div align="center">

**Maintained by [Shuddha](https://github.com/arengshuddho-hue)**
CSE-57, Section C — Dept. of CSE

</div>