const express = require("express");
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getMyBlogs,
} = require("../controller/blog-controller");
const { requireAuth } = require("../middleware/require-auth");

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.get("/mine", requireAuth, getMyBlogs);
blogRouter.post("/add", requireAuth, addBlog);
blogRouter.put("/update/:id", requireAuth, updateBlog);
blogRouter.delete("/:id", requireAuth, deleteBlog);
blogRouter.get("/:id", getById);

module.exports = blogRouter;
