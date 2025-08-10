import { Event, User } from "@/types";
import {
  saveUser,
  saveCurrentUser,
  saveUserEvents,
} from "@/utils/localStorage";

export const seedDemoData = () => {
  // Create demo user
  const demoUser: User = {
    id: "demo-user-1",
    email: "demo@example.com",
    name: "Demo User",
    createdAt: new Date().toISOString(),
  };

  // Create demo events
  const demoEvents: Event[] = [
    {
      id: "event-1",
      title: "React Conference 2025",
      description:
        "A comprehensive conference covering the latest in React development, featuring industry experts and hands-on workshops.",
      eventType: "Online",
      eventLink: "https://zoom.in/",
      startDateTime: "2025-08-15T09:00:00.000Z",
      endDateTime: "2025-08-15T17:00:00.000Z",
      category: "Technology",
      organizer: "Demo User",
      organizerId: "demo-user-1",
      createdAt: "2025-08-08T07:00:00.000Z",
      updatedAt: "2025-08-08T07:00:00.000Z",
    },
    {
      id: "event-2",
      title: "Team Building Workshop",
      description:
        "Interactive team building activities designed to improve collaboration and communication among team members.",
      eventType: "In-Person",
      location: "Conference Center, Downtown Office",
      startDateTime: "2025-08-20T10:00:00.000Z",
      endDateTime: "2025-08-20T16:00:00.000Z",
      category: "Business",
      organizer: "Demo User",
      organizerId: "demo-user-1",
      createdAt: "2025-08-08T07:00:00.000Z",
      updatedAt: "2025-08-08T07:00:00.000Z",
    },
    {
      id: "event-3",
      title: "TypeScript Deep Dive",
      description:
        "Advanced TypeScript concepts and best practices for enterprise applications.",
      eventType: "Online",
      eventLink: "https://meet.google.com/typescript",
      startDateTime: "2025-08-25T14:00:00.000Z",
      endDateTime: "2025-08-25T18:00:00.000Z",
      category: "Technology",
      organizer: "Demo User",
      organizerId: "demo-user-1",
      createdAt: "2025-08-08T07:00:00.000Z",
      updatedAt: "2025-08-08T07:00:00.000Z",
    },
    {
      id: "event-4",
      title: "Wellness Wednesday Yoga",
      description:
        "Weekly yoga session focused on mindfulness and stress relief for better work-life balance.",
      eventType: "In-Person",
      location: "Wellness Room, 5th Floor",
      startDateTime: "2025-08-27T12:00:00.000Z",
      endDateTime: "2025-08-27T13:00:00.000Z",
      category: "Health & Wellness",
      organizer: "Demo User",
      organizerId: "demo-user-1",
      createdAt: "2025-08-08T07:00:00.000Z",
      updatedAt: "2025-08-08T07:00:00.000Z",
    },
  ];

  // Save to localStorage
  saveUser(demoUser);
  localStorage.setItem(
    "password_demo@example.com",
    btoa("demo123" + "salt_key")
  );
  saveCurrentUser(demoUser);
  saveUserEvents(demoUser.id, demoEvents);

  console.log("Demo data seeded successfully!");
  console.log("Use email: demo@example.com, password: demo123 to login");
};

// Helper to clear all data
export const clearAllData = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    // Clear all user-specific events
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("eventapp_user_events_")) {
        localStorage.removeItem(key);
      }
    });

    // Clear other data
    localStorage.removeItem("eventapp_users");
    localStorage.removeItem("eventapp_current_user");
    localStorage.removeItem("eventapp_events"); // Legacy global events

    // Clear password keys
    keys.forEach((key) => {
      if (key.startsWith("password_")) {
        localStorage.removeItem(key);
      }
    });
  }
  console.log("All data cleared!");
};
