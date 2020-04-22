module.exports = (app,uploader) => {
  const students = require("../controllers/students.controller.js");

  app.post("/login", uploader, students.login);

  app.post("/update_pin", uploader, students.updatePin);
};
