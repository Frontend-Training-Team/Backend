import multer from 'multer'

// Memory Storage
const storage = multer.memoryStorage()

// Images Only
const fileFilter = (req, file, cb) => {

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (allowedMimeTypes.includes(file.mimetype)) {
    // accepted file
    cb(null, true)
  } else {
    // file rejected and returned error
    cb(new Error('Only image files are allowed!'), false)
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB 
  },
})

// upload single image 
export const uploadSingle = (fieldName) => {
  return upload.single(fieldName)
};

// upload multiple images , max count for one upload
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount)
};