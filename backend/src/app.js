import express from "express";

// Create an express app
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

export default app;
