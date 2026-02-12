import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads/resumes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, unique);
  },
});

export const uploadResume = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF/DOC/DOCX allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
