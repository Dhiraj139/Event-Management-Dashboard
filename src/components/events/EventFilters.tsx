"use client";

import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { EventFilters, EVENT_CATEGORIES } from "@/types";

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
}

export const EventFiltersComponent: React.FC<EventFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.search ||
    filters.eventType !== "All" ||
    filters.category ||
    filters.startDate ||
    filters.endDate;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant='h6'>Filter & Search Events</Typography>
        {hasActiveFilters && (
          <Button
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            variant='outlined'
            size='small'
          >
            Clear All
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 3,
        }}
      >
        <TextField
          fullWidth
          label='Search Events'
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          placeholder='Search by title or description...'
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ gridColumn: { xs: "1 / -1", md: "1 / 3" } }}
        />

        <FormControl fullWidth>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={filters.eventType}
            label='Event Type'
            onChange={(e) => handleFilterChange("eventType", e.target.value)}
          >
            <MenuItem value='All'>All Types</MenuItem>
            <MenuItem value='Online'>Online</MenuItem>
            <MenuItem value='In-Person'>In-Person</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label='Category'
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <MenuItem value=''>All Categories</MenuItem>
            {EVENT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label='Start Date'
          type='date'
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label='End Date'
          type='date'
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label='Sort By'
            onChange={(e) =>
              handleFilterChange(
                "sortBy",
                e.target.value as "startDateTime" | "title"
              )
            }
          >
            <MenuItem value='startDateTime'>Start Date</MenuItem>
            <MenuItem value='title'>Title</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={filters.sortOrder}
            label='Sort Order'
            onChange={(e) =>
              handleFilterChange("sortOrder", e.target.value as "asc" | "desc")
            }
          >
            <MenuItem value='asc'>Ascending</MenuItem>
            <MenuItem value='desc'>Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default EventFiltersComponent;
