import express, { response } from "express";
import { verifyToken } from "../Middleware/auth.js";
import ContentService from "../service/contentService.js";
const router = express.Router();

router.post("/:type/:propertyId", verifyToken, async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // send headers right away

  try {
    const contentType = req.params.type;
    const propertyId = req.params.propertyId;

    const reponse = await ContentService.create(
      req.user,
      contentType,
      propertyId,
      res
    );
  } catch (e) {
    throw e;
  } finally {
    res.write(`${JSON.stringify({ finished: true })}\n`);
  }
});

router.get("/history/:propertyId", verifyToken, async (req, res) => {
  try {
    const history = await ContentService.getPropertyContentHistory(
      req.user,
      req.params.propertyId
    );
    return res.status(200).json({
      history: history,
    });
  } catch (e) {
    res.status(500).json({
      err: e.message,
    });
    // TODO make util function
  }
});

export default router;
