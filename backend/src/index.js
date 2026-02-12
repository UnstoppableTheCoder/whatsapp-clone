import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.config.js";

// env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;

// Exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

// MongoDB debug mode
// ? - Check this out later
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// MongoDB Connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info("Conneted to MongoDB");
});

let server = app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});

// Handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});
