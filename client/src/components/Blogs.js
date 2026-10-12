import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import { useSelector } from "react-redux";
import Blog from "./Blog";
import api from "../api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    api
      .get("/api/blogs")
      .then((response) => setBlogs(response.data.data?.blogs || []))
      .catch((err) => setError(err.response?.data?.message || "Could not load blogs."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = (deletedId) => {
    setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog._id !== deletedId));
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box sx={{ width: "min(calc(100% - 32px), 760px)", mx: "auto", pt: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" fontWeight={750} sx={{ color: "var(--text)" }}>
          All blogs
        </Typography>
        <Typography sx={{ mt: 0.75, color: "var(--muted)" }}>
          Stories and ideas from the Bloggy community.
        </Typography>
      </Box>

      {isLoading ? (
        <Typography textAlign="center" sx={{ mt: 8, color: "var(--muted)" }}>
          Loading blogs…
        </Typography>
      ) : error ? (
        <Box role="alert" sx={{ width: "min(calc(100% - 32px), 760px)", mx: "auto", mt: 4, p: 3, borderRadius: 3, color: "var(--text)", backgroundColor: "var(--surface)", border: "1px solid var(--form-border)" }}>
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
          <Box sx={{ width: 64, height: 64, mx: "auto", mb: 2, display: "grid", placeItems: "center", borderRadius: "50%", color: "var(--nav-selected-text)", backgroundColor: "var(--nav-selected)" }}>
            <AutoStoriesRoundedIcon fontSize="large" />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            No blogs yet
          </Typography>
          <Typography sx={{ maxWidth: 440, mx: "auto", mt: 1, mb: 3, color: "var(--muted)" }}>
            The community is quiet for now. Be the first to share a story.
          </Typography>
          <Button
            component={Link}
            to={isLoggedIn ? "/blogs/add" : "/login"}
            state={isLoggedIn ? undefined : { isSignupButtonPressed: true }}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2, px: 2.5, py: 1, fontWeight: 700, textTransform: "none" }}
          >
            {isLoggedIn ? "Write the first blog" : "Join and write"}
          </Button>
        </Box>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            isUser={localStorage.getItem("userId") === blog.user?._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user?.name || "Unknown user"}
            date={new Date(blog.date).toLocaleDateString()}
            onDelete={handleDelete}
          />
        ))
      )}
    </Box>
  );
};

export default Blogs;
