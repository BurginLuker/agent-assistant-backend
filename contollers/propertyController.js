import express from "express";
import multer from "multer";
import PropertyService from "../service/propertyService.js";
import { verifyToken } from "../Middleware/auth.js";
import { Images } from "openai/resources/images.js";
const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Important: attach multer middleware here
router.post("/new", verifyToken, upload.array("images"), async (req, res) => {
  try {
    const { geocode } = req.body;
    const files = req.files;

    await PropertyService.createNewProperty(req.user, geocode, files);
    res.status(201).json({
      message: "Property created successfully",
      received: {
        geocode,
        fileCount: files?.length || 0,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Failed to create property",
      details: error.message,
    });
  }
});

router.get("/all", verifyToken, upload.array("images"), async (req, res) => {
  try {
    res.status(200).json({
      properties: await PropertyService.findPropertiesByUser(req.user),
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Failed to get properties",
      details: error.message,
    });
  }
});

router.get("/:propertyId", verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      property: await PropertyService.findPropertyById(
        req.user,
        req.params.propertyId
      ),
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Failed to get properties",
      details: error.message,
    });
  }
});

export default router;
