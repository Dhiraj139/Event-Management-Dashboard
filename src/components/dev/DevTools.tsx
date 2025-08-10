"use client";

import React, { useState } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { seedDemoData, clearAllData } from "@/utils/seedData";

export const DevTools: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeedData = () => {
    try {
      seedDemoData();
      setMessage(
        "Demo data seeded successfully! You can now login with email: demo@example.com, password: demo123"
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch {
      setMessage("Error seeding data");
    }
  };

  const handleClearData = () => {
    try {
      clearAllData();
      setMessage("All data cleared successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch {
      setMessage("Error clearing data");
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <>
      <Fab
        color='secondary'
        aria-label='dev tools'
        sx={{
          position: "fixed",
          bottom: 32,
          left: 32,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <SettingsIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Developer Tools</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Use these tools for testing and development purposes only.
          </Typography>

          {message && (
            <Alert severity='info' sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button variant='outlined' onClick={handleSeedData} fullWidth>
              Seed Demo Data
            </Button>
            <Typography variant='caption' color='text.secondary'>
              Creates a demo user (demo@example.com / demo123) and sample events
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant='outlined'
              color='error'
              onClick={handleClearData}
              fullWidth
            >
              Clear All Data
            </Button>
            <Typography variant='caption' color='text.secondary'>
              Removes all users and events from localStorage
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DevTools;
