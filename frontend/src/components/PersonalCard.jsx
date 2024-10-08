import React, { useState, useEffect, useRef } from "react";
import { Modal, Select, Avatar, Button, List, Radio, Input } from "antd";
import { Button as MUIButton } from "@mui/material";
import { SearchOutlined } from "@ant-design/icons";

import "../assets/scss/AssignRoleModal.css";
import { apiCall } from "../helper";
import MessageAlert from "./MessageAlert";

const { Option } = Select;

const PersonalCard = ({
  visible,
  onOk,
  onCancel,
  refreshData,
  channelId,
  channelName,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [snackbarContent, setSnackbarContent] = useState("");

  // search term
  const seachRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  // student list
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  useEffect(() => {
    loadStudentData();
    setSelectedId(null);
    handleClear();
  }, []);
  // update selected student
  const handleSelect = (id, name, email) => {
    setSelectedId(id);
    setSelectedName(name);
    setSelectedEmail(email);
  };

  const loadStudentData = async () => {
    const response = await apiCall(
      "GET",
      "v1/user/student/list",
      null,
      token,
      true
    );

    if (!response) {
      setData([]);
      setFilteredData([]);
    } else if (response.error) {
      setData([]);
      setFilteredData([]);
    } else {
      const res = Array.isArray(response) ? response : [];
      setData(res);
      setFilteredData(res);
    }
  };

  // share a personal card
  const handleSubmit = async () => {
    if (!selectedId) {
      setSnackbarContent("Please select a personal card");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    if (!token) {
      setSnackbarContent("Please login first");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    const response_member = await apiCall(
      "GET",
      `v1/message/${channelId}/users/detail`,
      null,
      token,
      true
    );
    let notification = {};
    if (response_member && !response_member.error) {
      const userIds = response_member.users
        .map((user) => parseInt(user.userId, 10))
        .filter((id) => id !== parseInt(userId));
      notification = {
        content: `New Messages in channel: ${channelName}.`,
        to: userIds,
      };
    }
    const requestBody = {
      SenderId: userId,
      channelId: channelId,
      messageContent: {
        name: selectedName,
        email: selectedEmail,
      },
      messageType: 2,
      notification: notification,
    };

    const response = await apiCall(
      "POST",
      "v1/message/send",
      requestBody,
      token,
      true
    );
    if (!response) {
      return;
    } else if (response.error) {
      setSnackbarContent(response.error);
      setAlertType("error");
      setAlertOpen(true);
    } else {
      refreshData();
      setSnackbarContent("Share successfully.");
      setAlertType("success");
      setAlertOpen(true);
      setSelectedId(null);
      handleClear();
      onCancel();
    }
  };

  const handleCancel = () => {
    setSelectedId(null);
    handleClear();
    onCancel();
  };

  // search part
  const handleClear = () => {
    setSearchTerm("");
    loadStudentData();
  };

  const handleSearchStudents = async () => {
    const searchTerm = seachRef.current.input.value.toLowerCase();
    const filtered = data.filter((item) =>
      item.email.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Modal
        title="Share Student Card"
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Share
          </Button>,
        ]}
      >
        <div
          className="search"
          style={{ display: "flex", alignItems: "center", border: "none" }}
        >
          <Input
            ref={seachRef}
            size="large"
            placeholder="Search Student by email"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <MUIButton
            size="small"
            type="primary"
            onClick={handleSearchStudents}
            style={{ marginRight: "10px" }}
          >
            Filter
          </MUIButton>
          <MUIButton size="small" type="primary" onClick={handleClear}>
            Clear
          </MUIButton>
        </div>
        <List
          dataSource={filteredData}
          style={{ maxHeight: "400px", overflowY: "auto" }}
          renderItem={(item) => (
            <List.Item
              onClick={() =>
                handleSelect(item.userId, item.userName, item.email)
              }
              style={{ cursor: "pointer" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Radio
                  value={item.userId}
                  checked={selectedId === item.userId}
                  onChange={() =>
                    handleSelect(item.userId, item.userName, item.email)
                  }
                  style={{ marginRight: 16 }}
                />
                <Avatar
                  src={item.avatarURL ? item.avatarURL : ""}
                  style={{ marginRight: 16 }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <strong>Name:</strong> {item.userName}
                  </div>
                  <div>
                    <strong>Email:</strong> {item.email}
                  </div>
                  <div>
                    <strong>Course:</strong> {item.course}
                  </div>
                  <div>
                    <strong>Skills:</strong> {item.userSkills}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
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

export default PersonalCard;
