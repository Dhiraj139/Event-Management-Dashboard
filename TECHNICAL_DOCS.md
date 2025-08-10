# Technical Documentation - Event Management Dashboard

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: Next.js 15.4.6 with React 19.1.0
- **Language**: TypeScript 5.x
- **UI Library**: Material-UI (MUI) 7.3.1
- **Form Handling**: React Hook Form 7.62.0 with Yup validation
- **Date Management**: Date-fns 4.1.0 with MUI Date Pickers
- **State Management**: React Context API
- **Data Storage**: Browser localStorage
- **Styling**: Emotion (CSS-in-JS) with MUI theming

### Application Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Business      │    │   Data          │
│   Layer         │    │   Logic Layer   │    │   Layer         │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Pages         │◄──►│ • Contexts      │◄──►│ • localStorage  │
│ • Components    │    │ • Hooks         │    │ • Utils         │
│ • Forms         │    │ • Validation    │    │ • Types         │
│ • UI Elements   │    │ • State Mgmt    │    │ • Serialization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Detailed File Structure

```
poc/
├── 📋 Project Configuration
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── eslint.config.mjs         # ESLint configuration
│   └── next-env.d.ts             # Next.js type definitions
│
├── 🌐 Public Assets
│   └── public/
│       ├── file.svg, globe.svg   # UI icons
│       ├── next.svg, vercel.svg  # Brand icons
│       └── window.svg            # App icons
│
├── 💻 Source Code (src/)
│   ├── 🎯 Application Pages
│   │   └── app/
│   │       ├── layout.tsx        # Root layout with providers
│   │       ├── page.tsx          # Home/auth page
│   │       ├── globals.css       # Global styles
│   │       ├── favicon.ico       # App icon
│   │       └── dashboard/
│   │           └── page.tsx      # Dashboard page
│   │
│   ├── 🧩 UI Components
│   │   └── components/
│   │       ├── auth/             # Authentication components
│   │       │   ├── AuthPage.tsx      # Auth container
│   │       │   ├── LoginForm.tsx     # Login form
│   │       │   └── SignupForm.tsx    # Registration form
│   │       │
│   │       ├── dashboard/        # Dashboard components
│   │       │   └── Dashboard.tsx     # Main dashboard
│   │       │
│   │       ├── events/           # Event management components
│   │       │   ├── EventCard.tsx     # Event display card
│   │       │   ├── EventForm.tsx     # Event create/edit form
│   │       │   └── EventFilters.tsx  # Search and filter UI
│   │       │
│   │       ├── providers/        # React providers
│   │       │   └── DatePickerProvider.tsx # Date picker setup
│   │       │
│   │       └── dev/              # Development tools
│   │           └── DevTools.tsx      # Developer utilities
│   │
│   ├── 🗂️ State Management
│   │   └── contexts/
│   │       ├── AuthContext.tsx       # Authentication state
│   │       ├── EventContext.tsx      # Event data state
│   │       └── NotificationContext.tsx # UI notifications
│   │
│   ├── 🎨 Styling & Theme
│   │   └── theme/
│   │       └── theme.ts              # MUI theme configuration
│   │
│   ├── 📝 Type Definitions
│   │   └── types/
│   │       └── index.ts              # TypeScript interfaces
│   │
│   ├── 🛠️ Utility Functions
│   │   └── utils/
│   │       ├── localStorage.ts       # Data persistence
│   │       ├── dateUtils.ts          # Date/time utilities
│   │       ├── categoryColors.ts     # UI color mapping
│   │       └── seedData.ts           # Test data generation
│   │
│   └── 🛡️ Security
│       └── middleware.ts             # Route protection
│
└── 📚 Documentation
    ├── README.md                     # Project overview
    └── DOCUMENTATION.md              # Comprehensive docs
```

## 🔧 Component Architecture

### Context Providers Hierarchy

```tsx
<AuthProvider>
  <NotificationProvider>
    <EventProvider>
      <DatePickerProvider>
        <App />
      </DatePickerProvider>
    </EventProvider>
  </NotificationProvider>
</AuthProvider>
```

### Data Flow Pattern

```
User Action → Component → Context → Utils → localStorage
                  ↓           ↓        ↓         ↓
               UI Update ← State ← Processing ← Storage
```

## 📊 State Management

### AuthContext

```typescript
interface AuthContextType {
  user: User | null; // Current authenticated user
  login: (email, password) => Promise<boolean>;
  signup: (email, password, name) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean; // Computed property
}
```

### EventContext

```typescript
interface EventContextType {
  events: Event[]; // Current user's events
  addEvent: (eventData) => Promise<boolean>;
  updateEvent: (id, eventData) => Promise<boolean>;
  deleteEvent: (id) => void;
  getEventById: (id) => Event | undefined;
  checkEventOverlap: (event, excludeId?) => boolean;
}
```

### NotificationContext

```typescript
interface NotificationContextType {
  showNotification: (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
}
```

## 🏪 Data Storage Strategy

### localStorage Schema

```javascript
// Storage keys
{
  "eventapp_users": [User],              // All registered users
  "eventapp_current_user": User,         // Currently logged in user
  "eventapp_user_events_${userId}": [Event], // User-specific events
  "password_${email}": string            // Hashed password
}
```

### User Data Isolation

- Each user's events stored in separate localStorage key
- No cross-user data access possible
- Automatic data migration from global to user-specific storage

## 🔐 Security Implementation

### Authentication Flow

```
1. User submits credentials
2. Check user exists in localStorage
3. Verify password hash
4. Set user in context
5. Store current user in localStorage
6. Redirect to dashboard
```

### Route Protection (middleware.ts)

```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Client-side auth check (localStorage-based)
    return NextResponse.next();
  }

  return NextResponse.next();
}
```

### Password Security

- Passwords hashed using Base64 + salt (demo implementation)
- Never stored in plain text
- Verification through hash comparison

## 📱 Responsive Design

### Breakpoint Strategy

```typescript
// MUI theme breakpoints
{
  xs: 0,      // Mobile phones
  sm: 600,    // Small tablets
  md: 900,    // Tablets
  lg: 1200,   // Desktop
  xl: 1536    // Large desktop
}
```

### Component Responsiveness

- Dashboard: Grid layout adapts from 1-4 columns
- Forms: Stack vertically on mobile, side-by-side on desktop
- Navigation: Hamburger menu on mobile, full menu on desktop

## 🎨 UI/UX Design Patterns

### Material Design Implementation

- Consistent elevation (shadows) hierarchy
- Color palette following Material Design 3
- Typography scale with semantic meaning
- Interactive feedback (hover, focus, active states)

### Loading States

- Skeleton loaders for content
- Button spinners during actions
- Full-page loading for route transitions
- Progressive data loading

### Error Handling

- Form validation with real-time feedback
- Toast notifications for system messages
- Fallback UI for component errors
- Graceful degradation for feature failures

## 🔄 Data Validation

### Form Validation (Yup Schemas)

```typescript
// Login validation
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

// Event validation
const eventSchema = yup.object({
  title: yup.string().required(),
  startDateTime: yup.date().required(),
  endDateTime: yup
    .date()
    .min(yup.ref("startDateTime"), "End time must be after start time")
    .required(),
});
```

### Business Logic Validation

- Event overlap prevention
- Email uniqueness checking
- Date/time consistency validation
- User data isolation enforcement

## 🚀 Performance Optimizations

### React Optimizations

- `useMemo` for expensive computations (event filtering)
- `useCallback` for stable function references
- Conditional rendering to avoid unnecessary updates
- Context splitting to minimize re-renders

### Data Efficiency

- User-specific data loading only
- Lazy component loading
- Efficient localStorage operations
- Minimal data structure overhead

### Bundle Optimization

- Tree-shaking for unused code elimination
- Dynamic imports for code splitting
- Optimized Material-UI imports
- TypeScript for better compression

## 🧪 Development Tools

### DevTools Component Features

- Demo data seeding for testing
- Complete data clearing
- User data isolation debugging
- Development environment detection

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Consistent file naming conventions
- Comprehensive error boundaries

## 🔧 Build & Deployment

### Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run code quality checks
```

### Environment Configuration

- Development: Hot reloading, DevTools enabled
- Production: Optimized builds, DevTools disabled
- Environment-specific configurations

## 📋 API Design (localStorage Interface)

### User Management

```typescript
// Create user
saveUser(user: User): void

// Retrieve users
getUsers(): User[]
getUserByEmail(email: string): User | null
getCurrentUser(): User | null

// Session management
saveCurrentUser(user: User): void
clearCurrentUser(): void
```

### Event Management

```typescript
// User-specific events
saveUserEvents(userId: string, events: Event[]): void
getUserEvents(userId: string): Event[]
clearUserEvents(userId: string): void

// Legacy global events (for migration)
saveEvents(events: Event[]): void
getEvents(): Event[]
```

## 🔍 Testing Strategy

### Component Testing Areas

- Form validation and submission
- Event CRUD operations
- User authentication flow
- Data isolation verification
- Responsive design behavior

### Integration Testing

- Complete user journeys
- Cross-component data flow
- localStorage persistence
- Error handling scenarios

## 🔮 Future Enhancement Areas

### Technical Improvements

- Add proper backend API
- Implement real authentication
- Add data synchronization
- Enhance offline capabilities

### Feature Additions

- Event sharing between users
- Calendar integration
- Recurring events
- Event reminders/notifications
- Export/import functionality

### Performance Enhancements

- Virtual scrolling for large datasets
- Advanced caching strategies
- Progressive Web App features
- Better mobile experience

---

This technical documentation provides a comprehensive understanding of the codebase architecture, implementation decisions, and development practices used in the Event Management Dashboard application.
