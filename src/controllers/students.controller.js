const con = require("../config/db.js");
exports.login = (req, res) => {
  if (!req.body) {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Content can't be empty",
        success: true,
      })
    );
  }
  if (req.body.uid == undefined || req.body.uid == "") {
    res.send(
      JSON.stringify({ status_code: 200, message: "Enter UID", success: true })
    );
  }
  if (req.body.pin == undefined || req.body.pin == "") {
    res.send(
      JSON.stringify({ status_code: 200, message: "Enter PIN", success: true })
    );
  }
  con.query(
    `SELECT * FROM students_mst where uid=${req.body.uid} and pin=${req.body.pin}`,
    function (error, result, fields) {
      if (error) throw error;
      console.log(result);
      if (result.length > 0) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "Data fetch successfully",
            success: true,
            data: result[0],
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "You have entered wrong credentials",
            success: false,
          })
        );
      }
    }
  );
};
exports.updatePin = (req, res) => {
  if (req.body.uid == undefined || req.body.uid == "") {
    res.send(
      JSON.stringify({ status_code: 200, message: "Enter UID", success: true })
    );
  }
  if (req.body.newpin == undefined || req.body.newpin == "") {
    res.send(
      JSON.stringify({ status_code: 200, message: "Enter PIN", success: true })
    );
  }

  if (req.body.st_id == undefined || req.body.st_id == "") {
    res.send(
      JSON.stringify({
        status_code: 200,
        message: "Enter Student ID",
        success: true,
      })
    );
  }
  con.query(
    `UPDATE students_mst set pin=${req.body.newpin} where uid=${req.body.uid}`,
    function (error, result, fields) {
      if (error) throw error;
      console.log(result);
      if (result) {
        res.send(
          JSON.stringify({
            status_code: 200,
            message: "PIN updated successfully",
            success: true,
          })
        );
      } else {
        res.send(
          JSON.stringify({
            status_code: 404,
            message: "You have wrong data",
            success: false,
          })
        );
      }
    }
  );
};
