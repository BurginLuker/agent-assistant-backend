import express from "express";
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

app.get("/api/get-document-by-userId", verifyToken, async (req, res) => {
  if (req.user.user_id === "USER_NOT_FOUND") {
    res.status(400).json({
      error: "Permission Denied",
    });
    return;
  }

  const result = await generatedListings.getDocumentsByUserId(req.user.user_id);
  res.status(200).json(result);
});

// Add the generate endpoint that your React app is calling
app.post(
  "/api/generate",
  getUser,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { geocode, mode, focus, zillow } = req.body;
      const images = req.files || [];

      const description = await listingController.generateListingDescription(
        geocode,
        images,
        req.user,
        mode,
        focus,
        zillow === "true"
      );

      res.send(description);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send(error.message);
    }
  }
);

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
