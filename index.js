const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));

app.post("/profile", upload.single("avatar"), function (req, res, next) {
  console.log(`${req.fileName}`);
  res.send(`<h1>file has been uploaded successfully :D</h1>
            <img src="./uploads/${req.fileName}" />`);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("listening on port " + PORT));
