import { User, Event } from "@/types";

export const STORAGE_KEYS = {
  USERS: "eventapp_users",
  CURRENT_USER: "eventapp_current_user",
  EVENTS: "eventapp_events",
  USER_EVENTS_PREFIX: "eventapp_user_events_",
} as const;

// User management
export const saveUser = (user: User): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const users = getUsers();
      const existingUserIndex = users.findIndex((u) => u.email === user.email);

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  } catch (error) {
    console.warn("Failed to save user to localStorage:", error);
  }
};

export const getUsers = (): User[] => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    }
    return [];
  } catch (error) {
    console.warn("Failed to load users from localStorage:", error);
    return [];
  }
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find((user) => user.email === email) || null;
};

export const saveCurrentUser = (user: User): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (error) {
    console.warn("Failed to save current user to localStorage:", error);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  } catch (error) {
    console.warn("Failed to load current user from localStorage:", error);
    return null;
  }
};

export const clearCurrentUser = (): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.warn("Failed to clear current user from localStorage:", error);
  }
};

// Event management
export const saveEvents = (events: Event[]): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  } catch (error) {
    console.warn("Failed to save events to localStorage:", error);
  }
};

export const getEvents = (): Event[] => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const events = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return events ? JSON.parse(events) : [];
    }
    return [];
  } catch (error) {
    console.warn("Failed to load events from localStorage:", error);
    return [];
  }
};

// User-specific event management
export const saveUserEvents = (userId: string, events: Event[]): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const key = `${STORAGE_KEYS.USER_EVENTS_PREFIX}${userId}`;
      localStorage.setItem(key, JSON.stringify(events));
    }
  } catch (error) {
    console.warn("Failed to save user events to localStorage:", error);
  }
};

export const getUserEvents = (userId: string): Event[] => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const key = `${STORAGE_KEYS.USER_EVENTS_PREFIX}${userId}`;
      const events = localStorage.getItem(key);
      return events ? JSON.parse(events) : [];
    }
    return [];
  } catch (error) {
    console.warn("Failed to load user events from localStorage:", error);
    return [];
  }
};

export const clearUserEvents = (userId: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const key = `${STORAGE_KEYS.USER_EVENTS_PREFIX}${userId}`;
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("Failed to clear user events from localStorage:", error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Migration function to move global events to user-specific storage
export const migrateGlobalEventsToUserEvents = (): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const globalEvents = getEvents(); // Get events from global storage

      if (globalEvents.length > 0) {
        // Group events by organizerId
        const eventsByUser: { [userId: string]: Event[] } = {};

        globalEvents.forEach((event) => {
          const userId = event.organizerId || "unknown";
          if (!eventsByUser[userId]) {
            eventsByUser[userId] = [];
          }
          eventsByUser[userId].push(event);
        });

        // Save events to user-specific storage
        Object.entries(eventsByUser).forEach(([userId, userEvents]) => {
          if (userId !== "unknown") {
            saveUserEvents(userId, userEvents);
          }
        });

        // Clear global events after migration
        localStorage.removeItem(STORAGE_KEYS.EVENTS);

        console.log(
          "Successfully migrated global events to user-specific storage"
        );
      }
    }
  } catch (error) {
    console.warn("Failed to migrate global events:", error);
  }
};

// Simple password hashing (for demo purposes - in production use proper hashing)
export const hashPassword = (password: string): string => {
  return btoa(password + "salt_key");
};

export const verifyPassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return hashPassword(password) === hashedPassword;
};
