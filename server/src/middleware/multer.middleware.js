import multer from "multer";
import fs from "fs";
import path from "path";

const tempDirectory = path.resolve("public/temp");
fs.mkdirSync(tempDirectory, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const storage = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, tempDirectory);
  },
  filename: function (req, file, cd) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeFileName = path
      .basename(file.originalname)
      .replace(/\s+/g, "-");
    cd(null, `${uniqueSuffix}-${safeFileName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${file.mimetype}' is not allowed`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_BYTES || 25 * 1024 * 1024),
  },
});

export { upload };
