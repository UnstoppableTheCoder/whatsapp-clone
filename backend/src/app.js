import dotenv from "dotenv";
import express from "express";
import morgon from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";

// dotenv config
dotenv.config();

// Create an express app
const app = express();

// Middlewares
// Morgon -> Only on Development
if (process.env.NODE_ENV !== "production") {
  app.use(morgon("dev")); // HTTP logger middleware
}

// Helmet
app.use(helmet()); // Secures your Express app by setting various HTTP headers

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(mongoSanitize()); // Sanitizes user supplied data to prevent MongoDB Operator Injection

// Enable cookie parser
app.use(cookieParser());

// gzip compression
app.use(compression()); // Compresses response bodies for all request that travers through the middleware

// File upload
app.use(fileUpload({ useTempFiles: true }));

// Cors
app.use(
  cors({
    // origin: "http://localhost:3000", // later can add more options
  }),
);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

export default app;
