import express from "express";
import cors from "cors";
import multer from "multer";
import { verifyToken } from "./Middleware/auth.js";
import generatedListings from "./Documents/GeneratedListings.js";

const app = express();
const port = 3000; // You can choose any available port

import listingController from "./Controllers/ListingController.js";

// Configure multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS for all routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ], // Add your React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/documents", verifyToken, async (req, res) => {
  const result = await generatedListings.getDocumentsByUserId(req.user.user_id);
  res.status(200).json(result);
});

// Add the generate endpoint that your React app is calling
app.post(
  "/generate",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      console.log(req.user);

      const { geocode } = req.body;
      const images = req.files || [];

      const description = await listingController.generateListingDescription(
        geocode,
        images,
        req.user,
      );

      res.send(description);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).send(error.message);
    }
  },
);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
