import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const UserBlogs = () => {
  const [user, setUser] = useState(null);
  const id = localStorage.getItem("userId");

  const sendRequest = async () => {
    const res = await axios.get(`${config.BASE_URL}/api/blogs/user/${id}`);
    return res.data;
  };

  useEffect(() => {
    sendRequest()
      .then((response) => setUser(response.data?.user))
      .catch((err) => console.error("Failed to load your blogs:", err));
  }, []);

  const handleDelete = () => {
    sendRequest()
      .then((response) => setUser(response.data?.user))
      .catch((err) => console.error("Failed to reload your blogs:", err));
  };

  return (
    <div>
      {user?.blogs?.map((blog) => (
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
      ))}
    </div>
  );
};

export default UserBlogs;
