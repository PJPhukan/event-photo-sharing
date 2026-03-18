import multer from "multer";
import fs from "fs";
import path from "path";

const tempDirectory = path.resolve("public/temp");
fs.mkdirSync(tempDirectory, { recursive: true });

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
const upload = multer({
  storage: storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_BYTES || 25 * 1024 * 1024),
  },
});

export { upload };
