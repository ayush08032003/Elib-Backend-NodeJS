import express from "express";

const app = express();

// Routes..
// HTTP MEHTODS: GET,  POST, PUT, DELETE, PATCH etc..
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

export default app;
