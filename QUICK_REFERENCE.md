# Quick Reference Guide - Event Management Dashboard

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation & Setup

```bash
# Clone/navigate to project directory
cd poc

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 🔧 Common Development Tasks

### Adding a New Component

```tsx
// 1. Create component file
// src/components/[category]/[ComponentName].tsx

"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

interface ComponentNameProps {
  // Define props here
}

export const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {
  return (
    <Box>
      <Typography variant='h6'>Component Content</Typography>
    </Box>
  );
};

export default ComponentName;
```

### Adding New Context

```tsx
// 2. Create context file
// src/contexts/NewContext.tsx

"use client";
import React, { createContext, useContext, useState } from "react";

interface NewContextType {
  // Define context shape
}

const NewContext = createContext<NewContextType | undefined>(undefined);

export const useNew = () => {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error("useNew must be used within a NewProvider");
  }
  return context;
};

export const NewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Context implementation
  return <NewContext.Provider value={{}}>{children}</NewContext.Provider>;
};
```

### Adding New Types

```tsx
// 3. Add to src/types/index.ts
export interface NewType {
  id: string;
  name: string;
  createdAt: string;
}
```

### Adding Utility Functions

```tsx
// 4. Create or add to src/utils/[utilName].ts
export const newUtilFunction = (param: string): string => {
  // Implementation
  return processedParam;
};
```

## 📋 Project Conventions

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`
- Contexts: `PascalCaseContext.tsx`

### Import Order

```tsx
// 1. React imports
import React, { useState, useEffect } from "react";

// 2. Third-party imports
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

// 3. Internal imports
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { formatDate } from "@/utils/dateUtils";
```

### Component Structure

```tsx
"use client";

import React from "react";

// Props interface
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// Main component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState("");

  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 4. Render
  return <div>{/* JSX */}</div>;
};

export default Component;
```

## 🎯 Key Patterns Used

### Context Pattern

```tsx
// Provider component wraps children
<AuthProvider>
  <App />
</AuthProvider>;

// Consumer uses hook
const { user, login } = useAuth();
```

### Form Handling Pattern

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: yupResolver(validationSchema),
});

const onSubmit = async (data: FormData) => {
  // Handle form submission
};
```

### Loading State Pattern

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAsyncAction = async () => {
  setIsLoading(true);
  try {
    await asyncOperation();
  } finally {
    setIsLoading(false);
  }
};
```

## 🔍 Debugging Tips

### Common Issues & Solutions

#### "Cannot read property of undefined"

- Check if data exists before accessing
- Use optional chaining: `user?.name`
- Add loading states

#### Context not available

- Ensure component is wrapped in provider
- Check provider hierarchy in layout.tsx

#### Form validation not working

- Verify yup schema matches form fields
- Check resolver is properly connected
- Ensure validation schema is imported

#### Events not saving

- Check localStorage permissions
- Verify user is logged in
- Check browser console for errors

### Development Tools

```bash
# Check console errors
F12 → Console tab

# Inspect localStorage
F12 → Application → Local Storage

# React Developer Tools
Chrome/Firefox extension for React debugging

# Debug DevTools panel
Click gear icon (bottom left) in development
```

## 📱 Testing Locally

### User Flow Testing

1. **Create account**: Use DevTools to seed demo data
2. **Login**: demo@example.com / demo123
3. **Create event**: Test all form fields
4. **Test filters**: Search, sort, filter by category
5. **Edit event**: Modify existing event
6. **Delete event**: Remove event
7. **Logout**: Clear session and redirect

### Data Isolation Testing

1. Create User A, add events
2. Logout User A
3. Create User B
4. Verify User B doesn't see User A's events
5. Login User A again
6. Verify User A's events are still there

## 🔧 Configuration Files

### TypeScript Config (`tsconfig.json`)

- Path mapping: `@/` → `src/`
- Strict type checking enabled
- ES2022 target for modern features

### Next.js Config (`next.config.ts`)

- TypeScript support
- Optimized builds
- Route configuration

### ESLint Config (`eslint.config.mjs`)

- Next.js recommended rules
- TypeScript integration
- Code quality enforcement

## 🎨 Styling Guidelines

### MUI Theme Usage

```tsx
// Use theme values
sx={{
  color: 'primary.main',
  bgcolor: 'background.paper',
  p: theme => theme.spacing(2)
}}
```

### Responsive Design

```tsx
// Breakpoint-aware styling
sx={{
  display: { xs: 'block', md: 'flex' },
  flexDirection: { xs: 'column', md: 'row' }
}}
```

### Color Categories

```tsx
// Event category colors defined in utils/categoryColors.ts
const categoryColors = {
  Technology: "#2196f3",
  Business: "#4caf50",
  // ... more categories
};
```

## 📦 Dependencies Overview

### Core Dependencies

- **React 19**: UI library
- **Next.js 15**: React framework
- **TypeScript 5**: Type safety
- **Material-UI 7**: UI components

### Form & Validation

- **React Hook Form**: Form state management
- **Yup**: Schema validation
- **@hookform/resolvers**: Form-validation bridge

### Date & Time

- **date-fns**: Date utility functions
- **@mui/x-date-pickers**: Date picker components

### Development

- **ESLint**: Code linting
- **@types packages**: TypeScript definitions

## 🚨 Important Notes

### Security Considerations

- This is a demo app using localStorage
- Passwords are simply hashed (not production-ready)
- No server-side validation
- Client-side only authentication

### Production Readiness

- Replace localStorage with proper database
- Add server-side authentication
- Implement proper password hashing
- Add API endpoints for data operations
- Set up proper error logging

### Browser Support

- Modern browsers with ES2022 support
- localStorage availability required
- JavaScript must be enabled

---

## 📞 Quick Help

### Common Commands

```bash
npm run dev      # Start development
npm run build    # Production build
npm run lint     # Check code quality
npm run start    # Start production server
```

### File Locations

- Components: `src/components/[category]/`
- Contexts: `src/contexts/`
- Types: `src/types/`
- Utils: `src/utils/`
- Pages: `src/app/`

### Key Contacts (Contexts)

- Authentication: `useAuth()`
- Events: `useEvents()`
- Notifications: `useNotification()`

This quick reference should help you navigate and work with the codebase efficiently!
