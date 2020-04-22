const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser());

require("./routes/students.routes.js")(app,upload.none());
require("./routes/teachers.routes.js")(app,upload.none());

// SELECT * FROM class_section_subject_map INNER JOIN chapter_mst ON class_section_subject_map.id = chapter_mst.class_section_subject_id WHERE class_section_subject_map.class_id = 3 AND class_section_subject_map.subject_id = 8
app.listen(port, () => console.log(`App running at http://localhost:${port}/`));
