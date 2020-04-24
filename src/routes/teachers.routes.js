module.exports = (app, uploader) => {
  const teachers = require("../controllers/teacher.controller.js");
  const multer = require("multer");
  const con = require("../config/db.js");

  var diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype === "video/*" || file.mimetype === "application/pdf") {
        cb(null, "./public/file/questionnaire");
      } else {
        cb(null, "./public/file/question");
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  var storage = multer({
    storage: diskStorage,
  });
  var upload = storage.fields([
    { name: "tutorial_file", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]);

  app.post("/list_class", uploader, teachers.list_class);

  app.post("/class_wise_subjects", uploader, teachers.class_wise_subjects);

  app.post(
    "/class_subjects_wise_chapters",
    uploader,
    teachers.class_subjects_wise_chapters
  );

  //Create questionnaires
  app.post("/create_questionnaire", upload, (req, res) => {
    if (req.body.class_id == undefined || req.body.class_id == "") {
      res.send(
        JSON.stringify({
          status_code: 200,
          message: "Enter Class ID",
          success: true,
        })
      );
    }
    if (req.body.subject_id == undefined || req.body.subject_id == "") {
      res.send(
        JSON.stringify({
          status_code: 200,
          message: "Enter Subject ID",
          success: true,
        })
      );
    }
    if (req.body.chapter_id == undefined || req.body.chapter_id == "") {
      res.send(
        JSON.stringify({
          status_code: 200,
          message: "Enter Chapter ID",
          success: true,
        })
      );
    }

    if (req.body.teacher_id == undefined || req.body.teacher_id == "") {
      res.send(
        JSON.stringify({
          status_code: 200,
          message: "Enter Teacher ID",
          success: true,
        })
      );
    }

    if (
      req.files["tutorial_file"] == undefined ||
      req.files["tutorial_file"].length <= 0
    ) {
      res.send(
        JSON.stringify({
          status_code: 200,
          message: "Please select tutorial files",
          success: true,
        })
      );
    }

  var insertQuestionnaire = `INSERT INTO questionnaire_mst(class_id, subject_id, chapter_id, tutorial_file, teacher_id) VALUES (
    ${req.body.class_id},
    ${req.body.subject_id},
    ${req.body.chapter_id},
    "${req.files["tutorial_file"][0].originalname}",
    ${req.body.teacher_id})`;
    con.query(
      insertQuestionnaire,
      function (error, result, fields) {
        if (error) {
        }
        var questionnaireId = result.insertId;
        question_json = JSON.parse(req.body.question);
        for (q in question_json) {
          con.query(
            `INSERT INTO question(question_text, question_image) VALUES ("${question_json[q].question_text}","${question_json[q].image_key}")`,
            function (error, result, fields) {
              if (error) {
              }
              var questionId = result.insertId;
              con.query(
                `INSERT INTO questionnaire_questions(question_id, quiestionnaire_id) VALUES (${questionId},${questionnaireId})`,
                function (error, result, fields) {}
              );
            }
          );
        }
      }
    );

    res.send(
      JSON.stringify({
        status_code: 200,
        message: "You have created questionnaire successfully",
        success: true,
      })
    );
  });

  //Get student as per class,subject and chapter for questionnaire
  app.post(
    "/submitted_questionnaire_student",
    uploader,
    teachers.submitted_questionnaire_student
  );

  //Get student questionnaire filled answer
  app.post(
    "/student_wise_fill_questionnaire",
    uploader,
    teachers.student_wise_fill_questionnaire
  );
};
