🧠 readme-context.md
💬 Project Overview

This React project was initialized and scaffolded automatically using AI assistance (GitHub Copilot).
The goal was to create a modern, scalable React setup where everything works out of the box — so that running npm run dev immediately starts a fully functional app with clean structure and room for animations, UI components, and routing.

⚙️ AI Setup Summary
🪄 Step 1: Base Project

Copilot initialized a Vite + React project for faster builds and better developer experience.
It generated the base folder structure and set Landing.jsx as the default page displaying:

“Welcome to Ami”

🎨 Step 2: TailwindCSS Integration

Copilot installed and configured TailwindCSS with PostCSS and Autoprefixer.
It also updated:

tailwind.config.js → includes ./src/**/*.{js,jsx,ts,tsx}

index.css → contains Tailwind layers and global styles (fonts, colors, and base CSS)

This gives the project full access to Tailwind’s utility classes for styling and layout.

🎞️ Step 3: Framer Motion (Animation Ready)

Copilot added Framer Motion for smooth and declarative animations.
Example fade-in animation added to Landing.jsx to verify setup.

Later, reusable animation variants will be stored in a separate file utils/animations.js for cleaner code and scalability.

🧭 Step 4: React Router

React Router DOM was installed and configured to handle multiple pages.
A simple route setup was added in main.jsx:

/ → Landing.jsx

/about → placeholder About.jsx

This allows seamless navigation and future scalability for more routes.

🧱 Step 5: Components & Layout

Copilot created a components folder containing:

Navbar.jsx

Footer.jsx

Both are responsive and reusable, styled using Tailwind utility classes.
They’re imported into Landing.jsx to create a clean layout foundation.

🧩 Folder Structure
src/
  components/
    Navbar.jsx
    Footer.jsx
  pages/
    Landing.jsx
    About.jsx
  hooks/
  utils/
    animations.js
  assets/
  App.jsx
  main.jsx
index.css
tailwind.config.js

🚀 Running the Project

To start the local development server:

npm run dev


(you can also add "start": "vite" to package.json if you prefer using npm start.)

🌍 Notes

index.css contains global font, colors, and animations.

The setup is compatible with shadcn/ui, Framer Motion, and future UI libraries.

Environment variables can be added via .env when integrating APIs or backend services.

🔮 Next Steps

Add shadcn/ui for modern prebuilt components

Extend animations.js for reusable motion variants

Implement dynamic content in Landing.jsx

Connect API or backend if needed