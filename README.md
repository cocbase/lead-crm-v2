# LeadCRM - Education Lead Management System

A modern CRM application for managing student leads, built with React, TypeScript, and Supabase.

## Features

- Lead Management - Track student inquiries with detailed profiles
- Pipeline View - Drag-and-drop Kanban board for lead progression
- Follow-ups - Schedule and manage follow-up tasks
- Real-time Notifications - In-app notification system
- Reports & Analytics - Visual charts and performance metrics
- User Management - Role-based access control

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- Styling: TailwindCSS v4
- UI Components: Radix UI, shadcn/ui
- Animations: Framer Motion
- Charts: Recharts
- Database: Supabase (PostgreSQL)
- State Management: React Context API

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at: `http://localhost:5173`

### Demo Login

- Email: admin@leadcrm.edu
- Password: any password (demo mode)

## Project Structure

```
lead-crm-v2/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (AppContext)
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   └── routes.ts       # React Router config
│   ├── styles/             # Global styles
│   └── main.tsx            # App entry point
├── public/                 # Static assets
└── package.json
```

## Deployment

Build for production:

```bash
npm run build
```

Deploy the `/dist` folder to any static hosting:
- Vercel
- Netlify
- Cloudflare Pages

## License

MIT