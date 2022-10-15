const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// API routers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// API middlewares
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Update environment variables via `.env` file
dotenv.config();

// Create `express` server
const app = express();

// Connect to MongoDB server
connectDB();

// Add the data parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach API routes / routers
app.get("/", (req, res) => res.send("API is Running"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use(notFound);
app.use(errorHandler);

// Start listening for client requests
const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Sever running on port ${port}`)
);

// For any other unhandled error(s)
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
