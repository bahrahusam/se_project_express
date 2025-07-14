require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./utils/NotFoundError");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to WTWR_DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("The server will crash now!");
  }, 0);
});

// Main router
app.use("/", mainRouter);

// Fallback for unknown routes
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Log errors after routes
app.use(errorLogger);

//  Celebrate validation error handler
app.use(errors());

// Centralized error handling middleware (must be last according to project)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
