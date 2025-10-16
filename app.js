import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { getUser, verifyToken } from "./Middleware/auth.js";
import generatedListings from "./Documents/GeneratedListings.js";

const app = express();
const port = 8080; // You can choose any available port

import propertyController from "./contollers/propertyController.js";
import contentController from "./contollers/contentController.js";
import feedbackController from "./contollers/feedbackController.js";

// Enable CORS for all routes
app.use(cors());
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/healthcheck", (req, res) => {
  res.status(200).send({
    status: "OK",
  });
});

app.use("/api/property", propertyController);
app.use("/api/content", contentController);
app.use("/api/feedback", feedbackController);

app.listen(port, (error) => {
  console.log(`Express app listening at http://localhost:${port}`);
  if (error) {
    console.log(error);
    throw error;
  }
});

export default app;
