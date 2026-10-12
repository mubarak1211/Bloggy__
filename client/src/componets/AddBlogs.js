import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import config from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImg from "../../src/placeholder.jpg"

const labelStyles = {
  display: "block",
  mb: 0.75,
  mt: 2.5,
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "var(--text)",
};
const AddBlogs = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    imageURL: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const sendRequest = async () => {
    const res = await axios.post(`${config.BASE_URL}/api/blogs/add`, {
        title: inputs.title,
        desc: inputs.description,
        img: inputs.imageURL.trim() === "" ? placeholderImg : inputs.imageURL,
        user: localStorage.getItem("userId"),
      });
    return res.data;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sendRequest();
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed");
    }
  };
  return (
    <Box sx={{ px: 2, py: { xs: 3, sm: 6 } }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mx: "auto", maxWidth: 680 }}>
        <Box
          sx={{
            backgroundColor: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--form-border)",
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: "0 18px 50px rgba(31, 41, 64, 0.12)",
            p: { xs: 2.5, sm: 4 },
            transition: "background-color 450ms ease, color 450ms ease",
          }}
        >
          <Typography variant="h4" fontWeight={750} sx={{ color: "var(--text)" }}>
            Create a blog
          </Typography>
          <Typography sx={{ mt: 0.75, color: "var(--muted)" }}>
            Add a title, share your story, and choose an image.
          </Typography>

          {error && (
            <Typography role="alert" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <InputLabel htmlFor="blog-title" sx={labelStyles}>
            Title
          </InputLabel>
          <TextField
            id="blog-title"
            name="title"
            onChange={handleChange}
            value={inputs.title}
            placeholder="Give your post a clear title"
            fullWidth
            size="small"
            required
            sx={fieldStyles}
          />
          <InputLabel htmlFor="blog-description" sx={labelStyles}>
            Description
          </InputLabel>
          <TextareaAutosize
            id="blog-description"
            name="description"
            onChange={handleChange}
            minRows={6}
            value={inputs.description}
            placeholder="What would you like people to know?"
            required
            style={{
              width: "100%",
              minHeight: 150,
              padding: "12px 14px",
              border: "1px solid var(--form-border)",
              borderRadius: 8,
              background: "var(--field-surface)",
              color: "var(--text)",
              font: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outlineColor: "#7166b5",
            }}
          />
          <InputLabel htmlFor="blog-image" sx={labelStyles}>
            Image URL <Typography component="span" variant="caption" sx={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</Typography>
          </InputLabel>
          <TextField
            id="blog-image"
            name="imageURL"
            onChange={handleChange}
            value={inputs.imageURL}
            placeholder="https://example.com/image.jpg"
            fullWidth
            size="small"
            sx={fieldStyles}
          />
          <Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "var(--muted)" }}>
            Leave this blank to use the default image.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3, flexDirection: { xs: "column-reverse", sm: "row" } }}>
            <Button variant="outlined" onClick={() => navigate("/blogs")} sx={{ borderRadius: 2, px: 2.5 }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
              Publish blog
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "var(--field-surface)",
    color: "var(--text)",
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--form-border)" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8b83c4" },
};

export default AddBlogs;
