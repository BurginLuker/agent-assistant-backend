import express from "express";
import cors from "cors";
import multer from "multer";

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

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Add the generate endpoint that your React app is calling
app.post("/generate", upload.array("images", 5), async (req, res) => {
  try {
    const { geocode } = req.body;
    const images = req.files || [];

    const description = await listingController.generateListingDescription(
      geocode,
      images,
    );

    res.send(description);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Error processing your request");
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
