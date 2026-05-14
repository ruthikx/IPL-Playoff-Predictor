# 🏏 IPL Playoff Predictor

An interactive IPL playoff points table simulator built with React, TypeScript, and Recharts — predict team qualification scenarios by simulating remaining match results.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)

---

## 📖 About

**IPL Playoff Predictor** is a fan-built web tool that lets you simulate the Indian Premier League (IPL) season and explore playoff qualification scenarios. Simply pick match winners for upcoming fixtures and instantly see how the points table and playoff picture evolve — no manual math required.

Whether you're curious if your favourite team can still make it to the top 4, or want to figure out which upcoming match is the most crucial, this tool has you covered.

---

## ✨ Features

- 🔢 **Live Points Table** — Tracks wins, losses, points, and NRR for all 10 IPL teams
- 🎯 **Match Simulator** — Pick winners for remaining fixtures and see the table update in real time
- 📊 **Qualification Charts** — Visual breakdown of each team's playoff chances using Recharts
- 🔄 **Smooth Animations** — Powered by Framer Motion for a polished user experience
- 🧮 **State Management** — Zustand keeps the app state clean and predictable
- 📱 **Responsive Design** — Works on desktop and mobile via Tailwind CSS

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Dev server & bundler |
| Tailwind CSS 4 | Styling |
| Framer Motion | Animations |
| Recharts | Data visualizations |
| Zustand | State management |
| Lucide React | Icons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ruthikx/IPL-Playoff-Predictor.git

# Navigate into the project directory
cd IPL-Playoff-Predictor

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

---

## 📁 Project Structure

```
IPL-Playoff-Predictor/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript interfaces & types
│   ├── utils/           # Helper functions (points calc, NRR, etc.)
│   ├── App.tsx          # Root component
│   └── main.tsx         # App entry point
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

> Note: Update the `src/` structure above to match your actual folder layout.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- IPL schedule and team data sourced from publicly available information
- Inspired by the passion of IPL fans everywhere 🏟️

---

*Built with ❤️ by [ruthikx](https://github.com/ruthikx)*
