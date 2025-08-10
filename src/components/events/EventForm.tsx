"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Event, EventFormData, EVENT_CATEGORIES } from "@/types";
import { useEvents } from "@/contexts/EventContext";
import { useNotification } from "@/contexts/NotificationContext";
import { convertFromISOString, convertToISOString } from "@/utils/dateUtils";

// Simple validation schema
const eventSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  eventType: yup
    .string()
    .oneOf(["Online", "In-Person"])
    .required("Event type is required"),
  location: yup.string().when("eventType", {
    is: "In-Person",
    then: (schema) =>
      schema.required("Location is required for in-person events"),
    otherwise: (schema) => schema,
  }),
  eventLink: yup.string().when("eventType", {
    is: "Online",
    then: (schema) =>
      schema
        .url("Must be a valid URL")
        .required("Event link is required for online events"),
    otherwise: (schema) => schema,
  }),
  startDateTime: yup.string().required("Start date and time is required"),
  endDateTime: yup.string().required("End date and time is required"),
  category: yup.string().required("Category is required"),
}) as yup.ObjectSchema<EventFormData>;

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  event?: Event;
  onSuccess: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  event,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addEvent, updateEvent } = useEvents();
  const { showNotification } = useNotification();
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "Online",
      location: "",
      eventLink: "",
      startDateTime: "",
      endDateTime: "",
      category: EVENT_CATEGORIES[0],
    },
  });

  const eventType = watch("eventType");

  // Load form data
  useEffect(() => {
    if (event && open) {
      reset({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        location: event.location || "",
        eventLink: event.eventLink || "",
        startDateTime: convertFromISOString(event.startDateTime),
        endDateTime: convertFromISOString(event.endDateTime),
        category: event.category,
      });
    } else if (!event && open) {
      reset({
        title: "",
        description: "",
        eventType: "Online",
        location: "",
        eventLink: "",
        startDateTime: "",
        endDateTime: "",
        category: EVENT_CATEGORIES[0],
      });
    }
  }, [event, open, reset]);

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);

    if (new Date(data.endDateTime) <= new Date(data.startDateTime)) {
      showNotification("End time must be after start time", "error");
      setIsLoading(false);
      return;
    }

    const eventData = {
      ...data,
      startDateTime: convertToISOString(data.startDateTime),
      endDateTime: convertToISOString(data.endDateTime),
    };

    const success =
      isEditing && event
        ? await updateEvent(event.id, eventData)
        : await addEvent({ ...eventData, organizer: "", organizerId: "" });

    if (success) {
      onSuccess();
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              {...register("title")}
              label='Event Title'
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              {...register("description")}
              label='Description'
              multiline
              rows={3}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <FormControl component='fieldset'>
              <FormLabel component='legend'>Event Type</FormLabel>
              <Controller
                name='eventType'
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value='Online'
                      control={<Radio />}
                      label='Online'
                    />
                    <FormControlLabel
                      value='In-Person'
                      control={<Radio />}
                      label='In-Person'
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {eventType === "Online" && (
              <TextField
                {...register("eventLink")}
                label='Event Link'
                type='url'
                fullWidth
                error={!!errors.eventLink}
                helperText={errors.eventLink?.message}
              />
            )}

            {eventType === "In-Person" && (
              <TextField
                {...register("location")}
                label='Location'
                fullWidth
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Category'>
                    {EVENT_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                {...register("startDateTime")}
                label='Start Date & Time'
                type='datetime-local'
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDateTime}
                helperText={errors.startDateTime?.message}
              />

              <TextField
                {...register("endDateTime")}
                label='End Date & Time'
                type='datetime-local'
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.endDateTime}
                helperText={errors.endDateTime?.message}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Event"
              : "Create Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
