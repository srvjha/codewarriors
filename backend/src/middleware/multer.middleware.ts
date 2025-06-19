import multer from "multer";
import path from "path";



const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extention = path.extname(file.originalname);
    // saurav-1498713987.png
    cb(null, `${file.fieldname}-${uniqueSuffix}${extention}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1000 * 1000,
  },
});

