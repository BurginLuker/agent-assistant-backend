import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { getUser, verifyToken } from "./Middleware/auth.js";
import generatedListings from "./Documents/GeneratedListings.js";

const app = express();
const port = 8080; // You can choose any available port

import listingController from "./Controllers/ListingController.js";
import propertyController from "./contollers/propertyController.js";
import contentController from "./contollers/contentController.js";
import feedbackController from "./contollers/feedbackController.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: "draft-7", // Set rate limit headers according to the draft-7 standard
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Optional: Use a custom store like Redis or Memcached for distributed environments
});
app.use(limiter);

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

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
