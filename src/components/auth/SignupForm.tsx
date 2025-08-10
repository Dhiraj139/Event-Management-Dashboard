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

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const success = await signup(data.email, data.password, data.name);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("An account with this email already exists");
      }
    } catch {
      setError("An error occurred during signup");
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
              Create Account
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Join us to start managing your events
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
                {...register("name")}
                label='Full Name'
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                autoComplete='name'
                autoFocus
              />

              <TextField
                {...register("email")}
                label='Email Address'
                type='email'
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete='email'
              />

              <TextField
                {...register("password")}
                label='Password'
                type='password'
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete='new-password'
              />

              <TextField
                {...register("confirmPassword")}
                label='Confirm Password'
                type='password'
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete='new-password'
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant='body2' color='text.secondary'>
                  Already have an account?{" "}
                  <Link
                    component='button'
                    type='button'
                    variant='body2'
                    onClick={onSwitchToLogin}
                    sx={{ cursor: "pointer" }}
                  >
                    Sign in here
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

export default SignupForm;
