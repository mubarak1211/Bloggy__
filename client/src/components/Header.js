import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authActions, setDarkmode } from "../store";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import api from "../api";

const Header = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDarkmode);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const [value, setValue] = useState(0);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const profileColors = isDark
    ? { surface: "#1b2638", field: "#0f1827", text: "#eef3fb", muted: "#c4cede", border: "rgba(176, 190, 215, 0.3)" }
    : { surface: "#ffffff", field: "#f7f8fc", text: "#182235", muted: "#4b5568", border: "rgba(108, 121, 145, 0.3)" };
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme !== null) dispatch(setDarkmode(JSON.parse(savedTheme)));
  }, [dispatch]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/myBlogs")) setValue(1);
    else if (path.startsWith("/blogs/add")) setValue(2);
    else setValue(0);
  }, [location.pathname]);

  const handleDarkModeToggle = () => {
    const nextTheme = !isDark;
    localStorage.setItem("isDarkMode", nextTheme);
    dispatch(setDarkmode(nextTheme));
  };

  const handleTabChange = (event, nextValue) => setValue(nextValue);

  const openProfile = (event) => {
    setEditedName(user?.name || "");
    setIsEditingName(false);
    setProfileError("");
    setProfileAnchor(event.currentTarget);
  };

  const saveName = async () => {
    const name = editedName.trim();
    if (name.length < 2 || name.length > 60) {
      setProfileError("Name must be between 2 and 60 characters.");
      return;
    }
    setIsSavingName(true);
    setProfileError("");
    try {
      const response = await api.patch("/api/users/me", { name });
      dispatch(authActions.updateUser(response.data.data.user));
      setIsEditingName(false);
    } catch (error) {
      setProfileError(error.response?.data?.message || "Could not update your name.");
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        color: "var(--text)",
        backgroundColor: "var(--nav-surface)",
        backgroundImage: "none",
        borderBottom: "1px solid var(--nav-border)",
        backdropFilter: "blur(18px)",
        transition: "background-color 450ms ease, color 450ms ease, border-color 450ms ease",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: "min(calc(100% - 32px), 1240px)",
          minHeight: { xs: 62, sm: 72 },
          mx: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 0.5, sm: 2 },
        }}
      >
        <Box
          component={Link}
          to="/blogs"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: "inherit",
            textDecoration: "none",
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: "white",
              background: "linear-gradient(135deg, #7467c8, #398fa2)",
              boxShadow: "0 5px 14px rgba(79, 96, 170, 0.25)",
            }}
          >
            <AutoStoriesRoundedIcon fontSize="small" />
          </Box>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
            Bloggy
          </Typography>
        </Box>

        {isLoggedIn && (
          <Box
            sx={{
              order: { xs: 3, md: 2 },
              width: { xs: "100%", md: "auto" },
              mx: { md: "auto" },
              display: "flex",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 44,
                maxWidth: "100%",
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": {
                  minHeight: 40,
                  minWidth: { xs: 90, sm: 112 },
                  px: { xs: 1.25, sm: 2 },
                  mx: 0.25,
                  borderRadius: 2.5,
                  color: "var(--muted)",
                  fontSize: { xs: "0.78rem", sm: "0.875rem" },
                  fontWeight: 650,
                  textTransform: "none",
                  transition: "background-color 180ms ease, color 180ms ease",
                  "&.Mui-selected": {
                    color: "var(--nav-selected-text)",
                    backgroundColor: "var(--nav-selected)",
                  },
                },
              }}
            >
              <Tab disableRipple LinkComponent={Link} to="/blogs" label="All blogs" />
              <Tab disableRipple LinkComponent={Link} to="/myBlogs" label="My blogs" />
              <Tab disableRipple LinkComponent={Link} to="/blogs/add" label="Write" />
            </Tabs>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            ml: { xs: 0, md: "auto" },
            order: { xs: 2, md: 3 },
            flexShrink: 0,
          }}
        >
          {!isLoggedIn ? (
            <>
              <Button
                onClick={() => navigate("/login", { state: { isSignupButtonPressed: false } })}
                sx={{ color: "var(--text)", textTransform: "none", fontWeight: 650, minWidth: 0, px: { xs: 1, sm: 1.5 } }}
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate("/login", { state: { isSignupButtonPressed: true } })}
                variant="contained"
                disableElevation
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: { xs: 1.5, sm: 2 } }}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={openProfile}
                startIcon={<AccountCircleRoundedIcon />}
                aria-haspopup="menu"
                aria-expanded={Boolean(profileAnchor)}
                sx={{
                  color: "var(--text)",
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  maxWidth: { xs: 132, sm: 200 },
                  minWidth: 0,
                  px: { xs: 1, sm: 1.5 },
                  "& .MuiButton-startIcon": { mr: 0.75 },
                }}
              >
                <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name || "Profile"}
                </Box>
              </Button>
              <Button
                onClick={() => dispatch(authActions.logout())}
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: "var(--nav-border)",
                  color: "var(--text)",
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 650,
                  px: { xs: 1.25, sm: 2 },
                }}
              >
                Log out
              </Button>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { mt: 1, width: 300, maxWidth: "calc(100vw - 24px)", p: 2.25, borderRadius: 3, bgcolor: profileColors.surface, color: profileColors.text, border: `1px solid ${profileColors.border}`, boxShadow: "0 16px 44px rgba(25,35,55,.22)", backgroundImage: "none" } }}
              >
                <Typography variant="subtitle1" fontWeight={750} sx={{ mb: 1.75, color: profileColors.text }}>Your profile</Typography>
                <Typography variant="caption" sx={{ display: "block", color: profileColors.muted, mb: 0.5 }}>Name</Typography>
                {isEditingName ? (
                  <TextField
                    autoFocus
                    size="small"
                    fullWidth
                    value={editedName}
                    onChange={(event) => setEditedName(event.target.value)}
                    inputProps={{ maxLength: 60, "aria-label": "Edit your name" }}
                    sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { color: profileColors.text, backgroundColor: profileColors.field, "& fieldset": { borderColor: profileColors.border }, "&:hover fieldset": { borderColor: profileColors.muted }, "&.Mui-focused fieldset": { borderColor: "#7467c8" } }, "& .MuiInputBase-input": { color: profileColors.text } }}
                    onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); saveName(); } }}
                  />
                ) : (
                  <Typography sx={{ overflowWrap: "anywhere", mb: 1.5, color: profileColors.text }}>{user?.name || "Name unavailable"}</Typography>
                )}
                <Typography variant="caption" sx={{ display: "block", color: profileColors.muted, mb: 0.5 }}>Email</Typography>
                <Typography sx={{ overflowWrap: "anywhere", mb: 1.75, color: profileColors.text }}>{user?.email || "Email unavailable"}</Typography>
                {profileError && <Typography role="alert" color="error" variant="body2" sx={{ mb: 1.25 }}>{profileError}</Typography>}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  {isEditingName ? (
                    <>
                      <Button size="small" startIcon={<CloseRoundedIcon />} onClick={() => { setIsEditingName(false); setEditedName(user?.name || ""); setProfileError(""); }} sx={{ textTransform: "none" }}>Cancel</Button>
                      <Button size="small" variant="contained" startIcon={<SaveRoundedIcon />} onClick={saveName} disabled={isSavingName} sx={{ textTransform: "none" }}>
                        {isSavingName ? "Saving…" : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button size="small" startIcon={<EditRoundedIcon />} onClick={() => { setIsEditingName(true); setProfileError(""); }} sx={{ textTransform: "none" }}>Edit name</Button>
                  )}
                </Box>
              </Menu>
            </>
          )}
          <Tooltip title={isDark ? "Switch to day theme" : "Switch to night theme"}>
            <IconButton
              onClick={handleDarkModeToggle}
              aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
              sx={{
                width: 40,
                height: 40,
                color: "var(--text)",
                border: "1px solid var(--nav-border)",
                backgroundColor: "var(--nav-icon-surface)",
                transition: "transform 180ms ease, background-color 450ms ease",
                "&:hover": { transform: "rotate(-8deg)" },
              }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
