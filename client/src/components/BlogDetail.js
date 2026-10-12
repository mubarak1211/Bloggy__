import { Button, InputLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import api from "../api";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const labelStyles = { mb: 1, mt: 2, fontSize: { xs: "1rem", sm: "1.25rem" }, fontWeight: "bold" };

const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({ title: "", description: "" });
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDetails = useCallback(async () => {
    try {
      const res = await api.get(`/api/blogs/${id}`);
      const blogData = res.data.data.blog;
      setBlog(blogData);
      setInputs({
        title: blogData.title || "",
        description: blogData.desc || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this blog.");
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const sendRequest = async () => {
    try {
      const res = await api.put(`/api/blogs/update/${id}`, {
        title: inputs.title,
        desc: inputs.description,
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Could not update this blog.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const updated = await sendRequest();
    if (updated) navigate("/myBlogs/");
  };

  return (
    <div>
      {blog ? (
        <form onSubmit={handleSubmit}>
          <Box
            sx={{ backgroundColor: "var(--surface)", color: "var(--text)", transition: "background-color 450ms ease, color 450ms ease" }}
            border={3}
            borderColor="linear-gradient(90deg, rgba(58,75,180,1) 2%, rgba(116,49,110,1) 36%, rgba(2,0,161,1) 73%, rgba(69,92,252,1) 100%)"
            borderRadius={10}
            boxShadow="10px 10px 20px #ccc"
            padding={{ xs: 2, sm: 3 }}
            margin={"auto"}
            marginTop={3}
            display="flex"
            flexDirection={"column"}
            width="calc(100% - 32px)"
            maxWidth={760}
          >
            <Typography
              fontWeight={"bold"}
              padding={3}
              color="grey"
              variant="h3"
              textAlign={"center"}
              sx={{ color: "var(--text)" }}
            >
              Update Blog
            </Typography>
            {error && <Typography role="alert" color="error">{error}</Typography>}
            <InputLabel sx={labelStyles}>Title</InputLabel>
            <TextField
              name="title"
              onChange={handleChange}
              value={inputs.title}
              margin="auto"
              variant="outlined"
              required
            />
            <InputLabel sx={labelStyles}>Description</InputLabel>
            <TextField
              name="description"
              onChange={handleChange}
              value={inputs.description}
              margin="auto"
              variant="outlined"
              multiline
              rows={4}
              required
            />
            <Button
              sx={{ mt: 2, borderRadius: 4 }}
              variant="contained"
              color="warning"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      ) : (
        <Typography textAlign="center" mt={5} variant="h5">
          {error || "Loading blog details..."}
        </Typography>
      )}
    </div>
  );
};

export default BlogDetail;
