export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
  organizer: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface EventContextType {
  events: Event[];
  addEvent: (
    event: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<boolean>;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
  checkEventOverlap: (
    event: Omit<Event, "id" | "createdAt" | "updatedAt">,
    excludeId?: string
  ) => boolean;
}

export interface EventFilters {
  search: string;
  eventType: "All" | "Online" | "In-Person";
  category: string;
  startDate: string;
  endDate: string;
  sortBy: "startDateTime" | "title";
  sortOrder: "asc" | "desc";
}

export interface EventFormData {
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
}

export const EVENT_CATEGORIES = [
  "Technology",
  "Business",
  "Education",
  "Health & Wellness",
  "Arts & Culture",
  "Sports & Recreation",
  "Social & Networking",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
