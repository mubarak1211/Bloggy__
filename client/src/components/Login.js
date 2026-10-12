import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../api";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignupButtonPressed } = location.state || {};
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(Boolean(isSignupButtonPressed));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSignup(Boolean(isSignupButtonPressed));
  }, [isSignupButtonPressed]);

  const handleChange = (event) => {
    setInputs((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const type = isSignup ? "signup" : "login";
      const response = await api.post(`/api/users/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      const { user, token } = response.data.data;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("authToken", token);
      dispatch(authActions.login(user));
      navigate("/blogs");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to continue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 54,
      borderRadius: 2,
      backgroundColor: "var(--field-surface)",
      color: "var(--text)",
    },
    "& .MuiOutlinedInput-input": { boxSizing: "border-box", lineHeight: 1.4, py: 1.5 },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--form-border)" },
  };
  const labelSx = { display: "block", mb: 0.75, fontSize: "0.9rem", fontWeight: 650, color: "var(--text)" };

  return (
    <Box sx={{ px: 2, py: { xs: 4, sm: 7 }, minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "0.9fr 1.1fr" },
          overflow: "hidden",
          borderRadius: { xs: 3, sm: 4 },
          backgroundColor: "var(--surface)",
          border: "1px solid var(--form-border)",
          boxShadow: "0 22px 65px rgba(31, 41, 64, 0.16)",
          transition: "background-color 450ms ease, color 450ms ease",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 500,
            p: 5,
            color: "white",
            background: "linear-gradient(145deg, #344c85 0%, #6c5ca8 55%, #39899a 100%)",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.82 }}>
            Bloggy community
          </Typography>
          <Box>
            <Typography variant="h3" fontWeight={750} sx={{ lineHeight: 1.12, mb: 2 }}>
              Stories are better when shared.
            </Typography>
            <Typography sx={{ lineHeight: 1.7, opacity: 0.86 }}>
              Sign in to pick up where you left off, or create an account and publish your first story.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            Read, write, and share what matters to you.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, sm: 5 }, alignSelf: "center" }}>
          <Typography variant="h4" fontWeight={750} sx={{ color: "var(--text)" }}>
            {isSignup ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography sx={{ color: "var(--muted)", mt: 1, mb: 3 }}>
            {isSignup ? "A few details and you are ready to write." : "Sign in to continue to your stories."}
          </Typography>

          {error && (
            <Typography role="alert" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {isSignup && (
            <>
              <InputLabel htmlFor="auth-name" sx={labelSx}>Name</InputLabel>
              <TextField
                id="auth-name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                value={inputs.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ ...fieldSx, mb: 2 }}
              />
            </>
          )}
          <InputLabel htmlFor="auth-email" sx={labelSx}>Email address</InputLabel>
          <TextField
            id="auth-email"
            name="email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ ...fieldSx, mb: 2 }}
          />
          <InputLabel htmlFor="auth-password" sx={labelSx}>Password</InputLabel>
          <TextField
            id="auth-password"
            name="password"
            placeholder="Enter your password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={inputs.password}
            onChange={handleChange}
            inputProps={isSignup ? { minLength: 8 } : undefined}
            helperText={isSignup ? "Use at least 8 characters." : undefined}
            fullWidth
            required
            sx={{ ...fieldSx, mb: 2.5 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            disableElevation
            sx={{ py: 1.25, borderRadius: 2, fontWeight: 700, textTransform: "none" }}
          >
            {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </Button>

          <Typography textAlign="center" sx={{ mt: 3, color: "var(--muted)" }}>
            {isSignup ? "Already have an account? " : "New to Bloggy? "}
            <Button
              type="button"
              onClick={() => {
                setError("");
                setIsSignup((signup) => !signup);
              }}
              sx={{ p: 0, minWidth: 0, ml: 0.5, textTransform: "none", fontWeight: 700, verticalAlign: "baseline" }}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
