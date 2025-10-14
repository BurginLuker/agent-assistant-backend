import express, { response } from "express";
import { verifyToken } from "../Middleware/auth.js";
import ContentService from "../service/contentService.js";
import { handleError } from "../utils/utils.js";
const router = express.Router();
import { Resend } from "resend";
import supabase from "../utils/supabaseClient.js";

const resend = new Resend(process.env.RESENT_API_KEY);

router.post("/submit", async (req, res) => {
  try {
    const params = [
      req.body.fullname,
      req.body.email,
      req.body.subject,
      req.body.message,
    ];
    for (const param of params) {
      if (typeof param !== "string" || param.length > 1000) {
        throw new Error("Malformed request");
      }
    }

    const escapeHtml = (value) =>
      typeof value === "string"
        ? value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";

    const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #1f2933; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">New Feedback Received</h2>
        <p><strong>Name:</strong> ${escapeHtml(req.body.fullname)}</p>
        <p><strong>Email:</strong> ${escapeHtml(req.body.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(req.body.subject)}</p>
        <hr style="border: none; border-top: 1px solid #d2d6dc; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${escapeHtml(req.body.message)}</p>
      </div>
    `;

    resend.emails.send({
      from: "agentassistant@resend.dev",
      to: "burginluker@gmail.com",
      subject: req.body.subject,
      html: emailBody,
    });

    const { data, error } = await supabase.from("Feedback").insert({
      fullname: req.body.fullname,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });
    if (error) {
      throw error;
    }

    return res.status(200).json({
      email: "sent",
    });
  } catch (e) {
    handleError(res, e);
  }
});

export default router;
