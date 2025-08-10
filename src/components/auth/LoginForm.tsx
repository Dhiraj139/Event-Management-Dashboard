"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  Link,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const success = await login(data.email, data.password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant='h4'
              component='h1'
              gutterBottom
              color='primary'
            >
              Event Manager
            </Typography>
            <Typography variant='h5' gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Sign in to manage your events
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                {...register("email")}
                label='Email Address'
                type='email'
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete='email'
                autoFocus
              />

              <TextField
                {...register("password")}
                label='Password'
                type='password'
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete='current-password'
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={isLoading}
                sx={{ mt: 3 }}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant='body2' color='text.secondary'>
                  Don&apos;t have an account?{" "}
                  <Link
                    component='button'
                    type='button'
                    variant='body2'
                    onClick={onSwitchToSignup}
                    sx={{ cursor: "pointer" }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
