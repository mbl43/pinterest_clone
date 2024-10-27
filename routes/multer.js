const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path=require('path')

const storage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, "./public/images/uploads"); // Folder where files will be saved
  },
  // Naming the file with its original extension
  filename: (req, file, cb) => {
    const uniqueFilename = uuidv4();

    cb(null, uniqueFilename+path.extname(file.originalname));
  },
});
const upload=multer({storage:storage})
module.exports=upload;