"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { Event } from "@/types";
import { formatDateTime } from "@/utils/dateUtils";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  canEdit: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => onEdit(event);
  const handleDeleteClick = () => setDeleteDialogOpen(true);
  const handleDeleteConfirm = () => {
    onDelete(event.id);
    setDeleteDialogOpen(false);
  };
  const handleDeleteCancel = () => setDeleteDialogOpen(false);

  // Simplified color helpers
  const eventTypeColor = event.eventType === "Online" ? "primary" : "secondary";
  const categoryColor = "default";

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          borderLeft: "3px solid lightblue",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" component="h3" gutterBottom>
              {event.title}
            </Typography>
            <Box>
              <Tooltip title="Edit Event">
                <IconButton size="small" onClick={handleEdit} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Event">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </Typography>

          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              label={event.eventType}
              color={eventTypeColor}
              size="small"
              variant="outlined"
            />
            <Chip label={event.category} color={categoryColor} size="small" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarIcon
                sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(event.startDateTime)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarIcon
                sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                to {formatDateTime(event.endDateTime)}
              </Typography>
            </Box>
          </Box>

          {event.location && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationIcon
                sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
            </Box>
          )}

          {event.eventLink && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LinkIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                  cursor: "pointer",
                  wordBreak: "break-all",
                }}
                component="a"
                href={event.eventLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Event
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <PersonIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Organized by {event.organizer}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event &quot;{event.title}&quot;?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;
