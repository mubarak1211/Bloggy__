import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const sendRequest = async () => {
    const res = await axios.get(`${config.BASE_URL}/api/blogs`);
    return res.data;
  };
  useEffect(() => {
    sendRequest()
      .then((response) => setBlogs(response.data.blogs))
      .catch((err) => console.error("Failed to load blogs:", err));
  }, []);
  return (
    <div>
      {blogs.map((blog) => (
          <Blog
            key={blog._id}
            id={blog._id}
            isUser={localStorage.getItem("userId") === blog.user?._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user?.name || "Unknown user"}
            date={new Date(blog.date).toLocaleDateString()}
          />
        ))}
    </div>
  );
};

export default Blogs;
