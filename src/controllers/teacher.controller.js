const con = require("../config/db.js");

exports.list_class = (req, res) => {
  if (req.body.teacher_id == undefined || req.body.teacher_id == "") {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Enter Teacher ID",
        success: true,
      })
    );
  }

  con.query(
    `SELECT * from class_mst WHERE class_id in (SELECT DISTINCT class_section_subject_map.class_id FROM teacher_mst JOIN teacher_wise_class_section_subject JOIN class_section_subject_map ON
          teacher_mst.id = teacher_wise_class_section_subject.teacher_id AND teacher_wise_class_section_subject.class_section_subject_id = class_section_subject_map.id WHERE teacher_mst.id = ${req.body.teacher_id})`,
    function (error, result, fields) {
      if (error) throw error;
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Classes data fetched successfully.",
            success: true,
            data: result,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "You have not assigned any classes.",
            success: false,
          })
        );
      }
    }
  );
};

exports.class_wise_subjects = (req, res) => {
  if (req.body.class_id == undefined || req.body.class_id == "") {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Enter Class ID",
        success: true,
      })
    );
  }

  con.query(
    `SELECT subjects_mst.subject_id as subject_id,subjects_mst.title as title FROM class_section_subject_map INNER JOIN subjects_mst ON class_section_subject_map.subject_id = subjects_mst.subject_id WHERE class_id=${req.body.class_id} AND subjects_mst.is_active=1 `,
    function (error, result, fields) {
      if (error) throw error;
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Subjects data fetched successfully.",
            success: true,
            data: result,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "You have not assigned any classes.",
            success: false,
          })
        );
      }
    }
  );
};

exports.class_subjects_wise_chapters = (req, res) => {
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

  con.query(
    `SELECT chapter_mst.id,chapter_mst.chapter_no,chapter_mst.chapter_name FROM class_section_subject_map INNER JOIN chapter_mst ON class_section_subject_map.id = chapter_mst.class_section_subject_id WHERE class_section_subject_map.class_id = ${req.body.class_id} AND class_section_subject_map.subject_id = ${req.body.subject_id} AND chapter_mst.is_active=1`,
    function (error, result, fields) {
      if (error) throw error;
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Chapters data fetched successfully.",
            success: true,
            data: result,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "You have not assigned any classes.",
            success: false,
          })
        );
      }
    }
  );
};

exports.create_questionnaires = (req, res) => {
  question_json = JSON.parse(req.body.question);
  console.log(question_json["question"]);
  res.send("OK");
};

exports.submitted_questionnaire_student = (req, res) => {
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

  con.query(
    `SELECT
      students_mst.roll_no,
      students_mst.name,
      questionnaire_result_mst.question_completed,
      questionnaire_result_mst.question_pending,
      questionnaire_mst.id AS questionnnaire_id,
      students_mst.st_id
    FROM
      questionnaire_mst
    INNER JOIN students_mst INNER JOIN questionnaire_result_mst ON questionnaire_mst.class_id = students_mst.class_id AND questionnaire_result_mst.questionnaire_id = questionnaire_result_mst.questionnaire_id
    WHERE
      questionnaire_mst.class_id = ${req.body.class_id} AND questionnaire_mst.subject_id = ${req.body.subject_id} AND questionnaire_mst.chapter_id = ${req.body.chapter_id}`,
    function (error, result, fields) {
      if (error) throw error;
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Students data fetched successfully.",
            success: true,
            data: result,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "There is no student found who gave an exam.",
            success: false,
          })
        );
      }
    }
  );
};

exports.student_wise_fill_questionnaire = (req, res) => {
  if (req.body.questionnaire_id == undefined || req.body.questionnaire_id == "") {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Enter Questionnaire ID",
        success: true,
      })
    );
  }

  if (req.body.student_id == undefined || req.body.student_id == "") {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Enter Student ID",
        success: true,
      })
    );
  }

  con.query(
    `SELECT
      questionnaire_mst.id AS questionnaire_id,
      question.question_text,
      question.question_image,
      question.id AS question_id,
      student_questionnaire_submission.is_checked,
      student_questionnaire_submission.answer_text,
      student_questionnaire_submission.answer_img
    FROM
      questionnaire_mst
    INNER JOIN 
      questionnaire_questions INNER JOIN question INNER JOIN student_questionnaire_submission ON questionnaire_mst.id = questionnaire_questions.quiestionnaire_id AND question.id = questionnaire_questions.question_id AND question.id = student_questionnaire_submission.question_id
    WHERE
      questionnaire_mst.id = ${req.body.questionnaire_id} AND student_questionnaire_submission.student_id = ${req.body.student_id}`,
    function (error, result, fields) {
      if (error) throw error;
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Questionnaire data fetched successfully.",
            success: true,
            data: result,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "There is no student found who gave an exam.",
            success: false,
          })
        );
      }
    }
  );
};
