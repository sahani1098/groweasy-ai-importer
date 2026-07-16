import { Router, Request, Response } from "express";
import upload from "../middleware/upload.middleware.js";
import { parseCSV } from "../services/csv.service.js";
import { extractCRMRecords } from "../services/ai.service.js";

const router = Router();

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Parse CSV
    const rows = parseCSV(req.file.buffer);

    // Send parsed rows to Gemini AI
    const aiResponse = await extractCRMRecords(rows);

    // Return response
    return res.status(200).json({
      success: true,
      totalRows: rows.length,
      imported: aiResponse.length,
      skipped: rows.length - aiResponse.length,
      records: aiResponse,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;