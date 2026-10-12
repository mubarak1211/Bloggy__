import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import Blog from "./Blog";
import api from "../api";

const UserBlogs = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const sendRequest = async () => {
    const res = await api.get("/api/blogs/mine");
    return res.data;
  };

  useEffect(() => {
    sendRequest()
      .then((response) => setUser(response.data?.user))
      .catch((err) => setError(err.response?.data?.message || "Could not load your blogs."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = () => {
    sendRequest()
      .then((response) => setUser(response.data?.user))
      .catch((err) => setError(err.response?.data?.message || "Could not refresh your blogs."));
  };

  const blogs = user?.blogs || [];

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box sx={{ width: "min(calc(100% - 32px), 760px)", mx: "auto", pt: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" fontWeight={750} sx={{ color: "var(--text)" }}>
          My blogs
        </Typography>
        <Typography sx={{ mt: 0.75, color: "var(--muted)" }}>
          Your posts, all in one place.
        </Typography>
      </Box>

      {isLoading ? (
        <Typography textAlign="center" sx={{ mt: 8, color: "var(--muted)" }}>
          Loading your blogs...
        </Typography>
      ) : error ? (
        <Box
          role="alert"
          sx={{
            width: "min(calc(100% - 32px), 760px)",
            mx: "auto",
            mt: 4,
            p: 3,
            borderRadius: 3,
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--form-border)",
          }}
        >
          {error}
        </Box>
      ) : blogs.length === 0 ? (
        <Box
          sx={{
            width: "min(calc(100% - 32px), 760px)",
            mx: "auto",
            mt: 4,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: 4,
            color: "var(--text)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--form-border)",
            boxShadow: "0 18px 50px rgba(31, 41, 64, 0.1)",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              color: "var(--nav-selected-text)",
              backgroundColor: "var(--nav-selected)",
            }}
          >
            <AutoStoriesRoundedIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Your story starts here
          </Typography>
          <Typography sx={{ maxWidth: 440, mx: "auto", mt: 1, mb: 3, color: "var(--muted)" }}>
            You have not published a blog with this account yet. Create your first post and it will show up here.
          </Typography>
          <Button
            component={Link}
            to="/blogs/add"
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2, px: 2.5, py: 1, fontWeight: 700, textTransform: "none" }}
          >
            Write your first blog
          </Button>
        </Box>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            isUser
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={user.name}
            onDelete={handleDelete}
          />
        ))
      )}
    </Box>
  );
};

export default UserBlogs;
