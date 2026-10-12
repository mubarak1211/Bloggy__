const Blog = require("../model/Blog");
const User = require("../model/User");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "_id name").sort({ date: -1 });
    return res.status(200).json(new ApiResponse(200, { blogs }, "Blogs loaded."));
  } catch (error) {
    console.error("Get blogs failed:", error);
    return res.status(500).json(new ApiError(500, "Could not load blogs."));
  }
};

const addBlog = async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const desc = typeof req.body.desc === "string" ? req.body.desc.trim() : "";
  const img = typeof req.body.img === "string" ? req.body.img.trim() : "";
  if (!title || !desc || !img) {
    return res.status(400).json(new ApiError(400, "Title, description, and image are required."));
  }

  try {
    const blog = await Blog.create({ title, desc, img, user: req.userId });
    await User.updateOne({ _id: req.userId }, { $push: { blogs: blog._id } });
    return res.status(201).json(new ApiResponse(201, { blog }, "Blog created."));
  } catch (error) {
    console.error("Create blog failed:", error);
    return res.status(500).json(new ApiError(500, "Could not create the blog."));
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const desc = typeof req.body.desc === "string" ? req.body.desc.trim() : "";
  if (!title || !desc) {
    return res.status(400).json(new ApiError(400, "Title and description are required."));
  }

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, desc },
      { new: true, runValidators: true },
    );
    if (!blog) return res.status(404).json(new ApiError(404, "Blog not found."));
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog updated."));
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json(new ApiError(400, "Invalid blog ID."));
    console.error("Update blog failed:", error);
    return res.status(500).json(new ApiError(500, "Could not update the blog."));
  }
};

const getById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "name");
    if (!blog) return res.status(404).json(new ApiError(404, "Blog not found."));
    return res.status(200).json(new ApiResponse(200, { blog }, "Blog loaded."));
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json(new ApiError(400, "Invalid blog ID."));
    return res.status(500).json(new ApiError(500, "Could not load the blog."));
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!blog) return res.status(404).json(new ApiError(404, "Blog not found."));
    await User.updateOne({ _id: req.userId }, { $pull: { blogs: blog._id } });
    return res.status(200).json(new ApiResponse(200, null, "Blog deleted."));
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json(new ApiError(400, "Invalid blog ID."));
    console.error("Delete blog failed:", error);
    return res.status(500).json(new ApiError(500, "Could not delete the blog."));
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email").populate({
      path: "blogs",
      options: { sort: { date: -1 } },
    });
    if (!user) return res.status(404).json(new ApiError(404, "Account not found."));
    return res.status(200).json(new ApiResponse(200, {
      user: { id: user._id, name: user.name, email: user.email, blogs: user.blogs },
    }, "Your blogs loaded."));
  } catch (error) {
    console.error("Get my blogs failed:", error);
    return res.status(500).json(new ApiError(500, "Could not load your blogs."));
  }
};

module.exports = { getAllBlogs, addBlog, updateBlog, getById, deleteBlog, getMyBlogs };
