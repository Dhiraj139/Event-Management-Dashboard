"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Fab,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import EventForm from "@/components/events/EventForm";
import EventCard from "@/components/events/EventCard";
import EventFiltersComponent from "@/components/events/EventFilters";
import { Event, EventFilters } from "@/types";

const defaultFilters: EventFilters = {
  search: "",
  eventType: "All",
  category: "",
  startDate: "",
  endDate: "",
  sortBy: "startDateTime",
  sortOrder: "asc",
};

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { events, deleteEvent } = useEvents();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Load filters from URL
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      eventType:
        (searchParams.get("eventType") as "All" | "Online" | "In-Person") ||
        "All",
      category: searchParams.get("category") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
      sortBy:
        (searchParams.get("sortBy") as "startDateTime" | "title") ||
        "startDateTime",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    });
    setIsLoading(false);
  }, [searchParams]);

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.eventType !== "All") params.set("eventType", filters.eventType);
    if (filters.category) params.set("category", filters.category);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.sortBy !== "startDateTime")
      params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder);

    router.replace(`/dashboard${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Handle redirect when user logs out
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event: Event) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower);

      const matchesType =
        filters.eventType === "All" || event.eventType === filters.eventType;
      const matchesCategory =
        !filters.category || event.category === filters.category;

      const eventDate = new Date(event.startDateTime)
        .toISOString()
        .split("T")[0];
      const afterStart = !filters.startDate || eventDate >= filters.startDate;
      const beforeEnd = !filters.endDate || eventDate <= filters.endDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        afterStart &&
        beforeEnd
      );
    });

    // Sort events
    filtered.sort((a: Event, b: Event) => {
      const aValue =
        filters.sortBy === "startDateTime"
          ? new Date(a.startDateTime)
          : a.title.toLowerCase();
      const bValue =
        filters.sortBy === "startDateTime"
          ? new Date(b.startDateTime)
          : b.title.toLowerCase();

      const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === "asc" ? compareResult : -compareResult;
    });

    return filtered;
  }, [events, filters]);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    // Remove router.push from here - let useEffect handle it
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsEventFormOpen(true);
  };

  const closeForm = () => {
    setIsEventFormOpen(false);
    setEditingEvent(undefined);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  if (!user) {
    return null; // Just return null without calling router.push during render
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* App Bar */}
      <AppBar position='static' elevation={1}>
        <Toolbar>
          <EventIcon sx={{ mr: 2 }} />
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Event Management Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant='body2'>Welcome, {user.name}</Typography>
            <IconButton
              size='large'
              edge='end'
              color='inherit'
              onClick={openMenu}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        onClick={closeMenu}
      >
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <Container maxWidth='xl' sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Your Events
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Manage and organize your events efficiently
          </Typography>
        </Box>

        {/* Filters */}
        <EventFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters(defaultFilters)}
        />

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <EventIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant='h5' gutterBottom color='text.secondary'>
              {events.length === 0 ? "No Events Yet" : "No Events Found"}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
              {events.length === 0
                ? "Create your first event to get started"
                : "Try adjusting your filters to find events"}
            </Typography>
            {events.length === 0 && (
              <Button
                variant='contained'
                size='large'
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
              >
                Create Your First Event
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: 3,
            }}
          >
            {filteredAndSortedEvents.map((event: Event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                canEdit={event.organizerId === user.id}
              />
            ))}
          </Box>
        )}

        {/* Floating Action Button */}
        <Fab
          color='primary'
          aria-label='add event'
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
          }}
          onClick={handleCreateEvent}
        >
          <AddIcon />
        </Fab>

        {/* Event Form Dialog */}
        <EventForm
          open={isEventFormOpen}
          onClose={closeForm}
          event={editingEvent}
          onSuccess={closeForm}
        />
      </Container>
    </Box>
  );
};

export default Dashboard;
