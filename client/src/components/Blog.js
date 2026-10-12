import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";
import api from "../api";
const Blogs = ({ title, desc, img, user, isUser, id, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/myBlogs/${id}`);
  };
  const deleteRequest = async () => {
    const res = await api.delete(`/api/blogs/${id}`);
    return res.data;
  };
  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteRequest();
      if (onDelete) onDelete(id);
      else navigate("/blogs");
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Could not delete this blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div>
      {" "}
      <Card
        sx={{
          width: "min(calc(100% - 32px), 760px)",
          margin: "auto",
          mt: { xs: 1.5, sm: 2.5 },
          padding: { xs: 1, sm: 2 },
          boxSizing: "border-box",
          bgcolor: "var(--surface)",
          color: "var(--text)",
          boxShadow: "0 12px 36px rgba(25, 35, 55, 0.12)",
          backdropFilter: "blur(12px)",
          transition: "background-color 450ms ease, color 450ms ease, box-shadow 250ms ease, transform 250ms ease",
          ":hover": {
            boxShadow: "0 18px 44px rgba(25, 35, 55, 0.2)",
            transform: "translateY(-2px)",
          },
        }}
      >
        {isUser && (
          <Box display="flex">
            <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }}>
              <ModeEditOutlineIcon color="warning" />
            </IconButton>
            <IconButton onClick={handleDelete} disabled={isDeleting} aria-label="Delete blog">
              {isDeleting ? <CircularProgress size={22} /> : <DeleteForeverIcon color="error" />}
            </IconButton>
          </Box>
        )}
        <CardHeader
          sx={{
            color: "var(--text)",
            "& .MuiCardHeader-title": { color: "var(--text)", overflowWrap: "anywhere" },
          }}
          avatar={
            <Avatar
              className={classes.font}
            sx={{ bgcolor: "#8b5cf6" }}
              aria-label="recipe"
            >
              {user ? user.charAt(0) : ""}
            </Avatar>
          }
          title={title}
        />
        <CardMedia
          component="img"
          image={img}
          alt={title}
          sx={{ width: "100%", height: "auto", maxHeight: 560, objectFit: "contain", bgcolor: "action.hover" }}
        />

        <CardContent>
          {deleteError && (
            <Typography role="alert" color="error" sx={{ mb: 1 }}>
              {deleteError}
            </Typography>
          )}
          <hr />
          <br />
          <Typography
            className={classes.font}
            variant="body2"
            color="text.secondary"
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            color: "var(--muted)",
            display: isExpanded ? "block" : "-webkit-box",
            WebkitLineClamp: isExpanded ? "unset" : 5,
            WebkitBoxOrient: "vertical",
            overflow: isExpanded ? "visible" : "hidden",
          }}
          >
            <b>{user}</b> {": "} {desc}
          </Typography>
          {desc?.length > 180 && (
            <button
              type="button"
              className="read-more-button"
              onClick={() => setIsExpanded((expanded) => !expanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Blogs;
