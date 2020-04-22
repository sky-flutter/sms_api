module.exports = (app, uploader) => {
  const teachers = require("../controllers/teacher.controller.js");

  app.post("/list_class", uploader, teachers.list_class);

  app.post("/class_wise_subjects", uploader, teachers.class_wise_subjects);
  
  app.post(
    "/class_subjects_wise_chapters",
    uploader,
    teachers.class_subjects_wise_chapters
  );
  //Create questionnaires
  app.post("/create_questionnaire", uploader, teachers.create_questionnaires);


  //fetch student list who give an exam
  //   SELECT
  //     students_mst.roll_no,
  //     students_mst.name,
  //     questionnaire_result_mst.question_completed,
  //     questionnaire_result_mst.question_pending,
  //     questionnaire_mst.id as questionnnaire_id,
  //     students_mst.st_id
  // FROM
  //     `questionnaire_mst`
  // INNER JOIN students_mst INNER JOIN questionnaire_result_mst ON questionnaire_mst.class_id = students_mst.class_id AND questionnaire_result_mst.questionnaire_id = questionnaire_result_mst.questionnaire_id


  //get student questionnaire filled answer
  // SELECT questionnaire_mst.id as questionnaire_id,question.question_text,question.question_image,question.id as question_id FROM questionnaire_mst INNER JOIN questionnaire_questions INNER JOIN question ON questionnaire_mst.id = questionnaire_questions.quiestionnaire_id AND question.id = questionnaire_questions.question_id WHERE questionnaire_mst.id = 1

};
