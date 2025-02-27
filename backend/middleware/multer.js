const multer = require("multer");

// Memory Storage (store file in RAM instead of disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
