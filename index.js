const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "uploads1"));
  },
  filename: function (req, file, cb) {
    const id = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + id + "-" + file.originalname;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

app.use("/profile-array", function (req, res, next) {
  req.filesName = [];
  next();
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "uploads2"));
  },
  filename: function (req, file, cb) {
    const id = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + id + "-" + file.originalname;
    req.filesName.push(fileName);
    cb(null, fileName);
  },
});

const uploadSingleFile = multer({ storage: storage1 });
const uploadMultipleFiles = multer({ storage: storage2 });

app.post("/profile", uploadSingleFile.single("single"), function (req, res) {
  res.send(`<h1>file has been uploaded successfully :D</h1>
            <img src="./uploads1/${req.fileName}" style="width:200px; height:200px; object-fit:cover" alt="photo"/>`);
});

app.post(
  "/profile-array",
  uploadMultipleFiles.array("multiple"),
  function (req, res) {
    res.send(`<h1>file has been uploaded successfully :D</h1>
    ${req.filesName.map(
      (fileName) =>
        ` <img
          src="./uploads2/${fileName}"
          style="width:200px; height:200px; object-fit:cover"
          alt="photo"
   />`
    )}`);
  }
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("listening on port " + PORT));
