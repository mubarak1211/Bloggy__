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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Header = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDarkmode);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [value, setValue] = useState(0);
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
