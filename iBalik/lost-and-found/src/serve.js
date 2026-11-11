import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload image
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileStr = req.file.buffer.toString("base64");
    const uploadResponse = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`);
    res.json({ url: uploadResponse.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
