const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { NOT_FOUND } = require("./utils/constants");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors } = require("celebrate");

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

// Main router
app.use("/", mainRouter);

// Fallback for unknown routes
app.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.statusCode = NOT_FOUND;
  next(error); // Pass to error handler
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
