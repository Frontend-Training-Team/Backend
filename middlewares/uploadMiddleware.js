import multer from "multer";
// Memory Storage
const storage = multer.memoryStorage();

// Images Only (Strict MimeTypes)
const fileFilter = (req, file, cb) => {
  const allowedImagesTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedImagesTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPG, PNG or WEBP images");
    error.status = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Upload single image
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple images (default max 5)
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
