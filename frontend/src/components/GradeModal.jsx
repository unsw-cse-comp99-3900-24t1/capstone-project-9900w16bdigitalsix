import React, { useState } from "react";
import { CardBody } from "reactstrap";
import { Button, Input, Modal, Typography } from "antd";
import TextField from "@mui/material/TextField";

import { apiCall } from "../helper";
import MessageAlert from "./MessageAlert";

const GradeModal = ({
  title,
  sprintData,
  visible,
  onOk,
  onCancel,
  gradeComment,
  setGradeComment,
  teamId,
  loadUserData,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [snackbarContent, setSnackbarContent] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // handle change for grade or comment
  const handleChangeGrade = (value, sprintNum) => {
    const updatedGradeComment = {
      ...gradeComment,
      grades: {
        ...gradeComment.grades,
        [sprintNum - 1]: value,
      },
    };
    setGradeComment(updatedGradeComment);
  };

  const handleChangeComment = (value, sprintNum) => {
    const updatedGradeComment = {
      ...gradeComment,
      comments: {
        ...gradeComment.comments,
        [sprintNum - 1]: value,
      },
    };
    setGradeComment(updatedGradeComment);
  };

  // handle edit grade:
  const handleSave = async () => {
    let sprints = [];
    // convert to standard format
    Object.keys(gradeComment.grades).map((key, index) => {
      let grade = gradeComment.grades[index];
      let comment = gradeComment.comments[index];

      let sprint = {
        sprintNum: parseInt(index + 1),
        grade: parseInt(grade),
        comment: comment,
      };
      sprints.push(sprint);
    });

    // call request
    const requestBody = {
      notification: {
        content: "Your team's grade has been updated",
        to: {
          teamId: parseInt(teamId),
        },
      },
      sprints: sprints,
      teamId: parseInt(teamId),
    };
    const response = await apiCall(
      "POST",
      `v1/progress/edit/grade`,
      requestBody,
      token,
      true
    );
    if (response.error) {
      setSnackbarContent("Student team has not start the graded sprint.");
      setAlertType("error");
      setAlertOpen(true);
      return;
    } else {
      setSnackbarContent("Update successfully.");
      setAlertType("success");
      setAlertOpen(true);
      loadUserData();
      onOk();
    }
  };

  // won't show edit button for students
  const renderFooter = () => {
    if (parseInt(role) !== 1) {
      return [
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ];
    }
    return null;
  };

  const renderSprints = () => {
    return sprintData.map((sprint) => (
      <CardBody key={sprint.sprintId}>
        <Typography.Title level={5} style={{ fontWeight: "bold" }}>
          {/* sprint title & calendar & date */}
          {sprint.sprintName}
        </Typography.Title>
        {/* list of user story */}
        <TextField
          id={`grade-${sprint.sprintName}`}
          label="Grade"
          type="text"
          fullWidth
          style={{ marginBottom: "16px" }}
          value={`${
            gradeComment &&
            gradeComment.grades[sprint.sprintNumber - 1] != undefined
              ? gradeComment.grades[sprint.sprintNumber - 1]
              : ""
          }`}
          onChange={(e) =>
            handleChangeGrade(e.target.value, sprint.sprintNumber)
          }
          disabled={parseInt(role) === 1}
        />
        <Input.TextArea
          id={`comment-${sprint.sprintName}`}
          placeholder="Comment"
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ marginBottom: "16px", borderColor: "#CBCBCB" }}
          onMouseOver={(e) => {
            e.target.style.borderColor = "black";
          }} // 鼠标悬停时边框颜色变化
          onMouseOut={(e) => {
            e.target.style.borderColor = "#CBCBCB";
          }}
          value={`${
            gradeComment &&
            gradeComment.comments[sprint.sprintNumber - 1] != undefined
              ? gradeComment.comments[sprint.sprintNumber - 1]
              : ""
          }`}
          onChange={(e) =>
            handleChangeComment(e.target.value, sprint.sprintNumber)
          }
          disabled={parseInt(role) === 1}
        />
      </CardBody>
    ));
  };

  return (
    <>
      <Modal
        title={title}
        open={visible}
        onOk={handleSave}
        onCancel={onCancel}
        footer={renderFooter}
        style={{ marginLeft: "8px", transform: "none" }}
        centered
      >
        <div className="modal-content">{renderSprints()}</div>
      </Modal>
      <MessageAlert
        open={alertOpen}
        alertType={alertType}
        handleClose={() => setAlertOpen(false)}
        snackbarContent={snackbarContent}
      />
    </>
  );
};

export default GradeModal;
