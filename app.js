import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { getUser, verifyToken } from "./Middleware/auth.js";
import cron from 'node-cron';

const app = express();
const port = 8080; // You can choose any available port

import propertyController from "./contollers/propertyController.js";
import contentController from "./contollers/contentController.js";
import feedbackController from "./contollers/feedbackController.js";
import supabase from "./utils/supabaseClient.js";

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


cron.schedule('0 */8 * * *', async () => {
  const tables = ['Content', 'Property', 'Feedback','PropertyFiles'];
  // Select a random table from the array
  const randomIndex = Math.floor(Math.random() * tables.length);
  const randomTable = tables[randomIndex];
  
  // Query 1 row from the randomly selected table
  const { data, error } = await supabase.from(randomTable).select().limit(1);
  if (error) {
    console.error(`Error fetching data from ${randomTable}:`, error);
  } else {
    console.log(`Data from ${randomTable}:`, data);
  }
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
