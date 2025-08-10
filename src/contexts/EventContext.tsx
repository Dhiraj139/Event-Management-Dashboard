"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventContextType } from "@/types";
import {
  generateId,
  saveUserEvents,
  getUserEvents,
  migrateGlobalEventsToUserEvents,
} from "@/utils/localStorage";
import { checkTimeOverlap } from "@/utils/dateUtils";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMigrated, setIsMigrated] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Run migration once on first load
  useEffect(() => {
    if (!isMigrated) {
      migrateGlobalEventsToUserEvents();
      setIsMigrated(true);
    }
  }, [isMigrated]);

  // Load events on mount and when user changes
  useEffect(() => {
    if (user) {
      const userEvents = getUserEvents(user.id);
      setEvents(userEvents);
    } else {
      // Clear events when no user is logged in
      setEvents([]);
    }
    setIsLoaded(true);
  }, [user]);

  // Save events when they change (user-specific)
  useEffect(() => {
    if (isLoaded && user) {
      saveUserEvents(user.id, events);
    }
  }, [events, isLoaded, user]);

  // Check if event overlaps with existing events
  const hasOverlap = (
    newEvent: Omit<Event, "id" | "createdAt" | "updatedAt">,
    excludeId?: string
  ) => {
    const eventsToCheck = excludeId
      ? events.filter((event) => event.id !== excludeId)
      : events;

    return eventsToCheck.some((event) =>
      checkTimeOverlap(
        newEvent.startDateTime,
        newEvent.endDateTime,
        event.startDateTime,
        event.endDateTime
      )
    );
  };

  const addEvent = async (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) {
      showNotification("You must be logged in to create events.", "error");
      return false;
    }

    if (hasOverlap(eventData)) {
      showNotification(
        "This event overlaps with another event. Please choose different times.",
        "error"
      );
      return false;
    }

    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      organizerId: user.id,
      organizer: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
    showNotification(
      `Event "${eventData.title}" created successfully!`,
      "success"
    );
    return true;
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    const existingEvent = events.find((event) => event.id === id);
    if (!existingEvent) {
      showNotification("Event not found.", "error");
      return false;
    }

    const updatedEvent = { ...existingEvent, ...eventData };

    // Check overlap if time is changing
    if (eventData.startDateTime || eventData.endDateTime) {
      if (hasOverlap(updatedEvent, id)) {
        showNotification(
          "Updated times overlap with another event. Please choose different times.",
          "error"
        );
        return false;
      }
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
          : event
      )
    );

    showNotification(
      `Event "${existingEvent.title}" updated successfully!`,
      "success"
    );
    return true;
  };

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find((event) => event.id === id);
    setEvents((prev) => prev.filter((event) => event.id !== id));

    if (eventToDelete) {
      showNotification(
        `Event "${eventToDelete.title}" deleted successfully!`,
        "success"
      );
    }
  };

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const checkEventOverlap = (
    event: Omit<Event, "id" | "createdAt" | "updatedAt">,
    excludeId?: string
  ) => {
    return hasOverlap(event, excludeId);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        checkEventOverlap,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
