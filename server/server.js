require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const { ApiError } = require("./utils/ApiError");

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: clientOrigin }));
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use((req, res) => {
  res.status(404).json(new ApiError(404, "Route not found."));
});

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(process.env.PORT) || 5001;
    app.listen(port, () => console.log(`API server listening on port ${port}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exitCode = 1;
  }
};

if (require.main === module) startServer();

module.exports = app;
