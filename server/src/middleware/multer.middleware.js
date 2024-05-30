import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, res, cd) {
    cd(null, "./public/temp");
  },
  filename: function (req, file, cd) {
    cd(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

export { upload };
