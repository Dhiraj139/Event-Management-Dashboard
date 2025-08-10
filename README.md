# Event Management Dashboard

A comprehensive Event Management Dashboard built with Next.js, TypeScript, and Material-UI. This application allows users to create, manage, and organize events with advanced filtering and search capabilities.

## 📚 Documentation

- **[Technical Documentation](./TECHNICAL_DOCS.md)** - Detailed technical documentation for developers

## Features

### 🔐 Authentication

- Local authentication using localStorage
- User registration and login
- Session persistence across page reloads
- Protected routes with automatic redirects

### 📅 Event Management

- **CRUD Operations**: Create, Read, Update, Delete events
- **Event Types**: Support for Online and In-Person events
- **Event Details**: Title, description, date/time, location/link, category, organizer
- **Overlap Prevention**: Automatic validation to prevent conflicting event times
- **Categories**: Predefined categories (Technology, Business, Education, etc.)

### 🔍 Advanced Filtering & Search

- **Search**: Real-time search by title and description
- **Filters**: Event type, category, date range
- **Sorting**: Sort by start date or title (ascending/descending)
- **URL Persistence**: Filter and search parameters saved in URL query string

### 🎨 User Interface

- **Material-UI Components**: Modern, responsive design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Cards**: Hover effects and intuitive controls
- **Dark/Light Theme**: Professional color scheme
- **Loading States**: Smooth user experience with loading indicators

### 🏗️ Technical Features

- **React Hook Form**: Robust form validation with Yup schema
- **Context API**: Centralized state management for auth and events
- **TypeScript**: Full type safety throughout the application
- **Next.js App Router**: Modern routing with file-based structure

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Form Handling**: React Hook Form with Yup validation
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Storage**: localStorage for client-side persistence
- **Styling**: Material-UI theme system with custom components

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd event-management-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
