```markdown
# DevMate Frontend

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

The frontend for DevMate - A Tinder-like platform for developers to connect, built with React, TypeScript, and Tailwind CSS.

🔗 **Backend Repository**: [DevMate Backend](https://github.com/agrim08/DevMate)

## Features

- 🎨 Beautiful, modern UI with dark/light mode
- 📱 Responsive design
- 🔄 Real-time updates with Socket.io
- 📝 Form validation with Zod and React Hook Form
- 🚀 Optimized performance with Vite
- 🧩 Component-based architecture with ShadCN UI
- 🌐 Client-side routing with React Router
- 🏗 State management with Redux Toolkit

## Tech Stack

- **Framework**: React
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router
- **Real-time**: Socket.io Client
- **Build Tool**: Vite
- **Theming**: next-themes
```

```bash
git clone https://github.com/yourusername/DevMateFrontend.git
cd DevMateFrontend
```

```bash
npm install
```

### For Dev Server
```bash
npm run dev
```

### For Prod Server
```bash
npm run build
```

/public
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── hooks/           # Custom hooks
├── lib/             # Utility functions
└── utils/           # Helper utilities

## Deployment
The frontend is deployed on AWS EC2 behind an Nginx server.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
