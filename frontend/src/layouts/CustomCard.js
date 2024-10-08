import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "../assets/scss/CustomCard.css";

const CustomCard = ({
  id,
  title,
  client,
  clientTitle,
  skills,
  field,
  onDelete,
}) => {
  const [modal, setModal] = useState(false);
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const skillsRef = useRef(null);

  const toggle = () => setModal(!modal);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/v1/project/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        onDelete(id);
      } else {
        console.error("Failed to delete the project.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the project:", error);
    }
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (skillsRef.current) {
        const skillsWidth = skillsRef.current.scrollWidth;
        const containerWidth = skillsRef.current.clientWidth;
        setShowMoreSkills(skillsWidth > containerWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [skills]);

  return (
    <>
      <Card className="mb-4 custom-card">
        <div className="custom-card-header">
          <h5 className="custom-card-title">{title}</h5>
        </div>
        <CardBody className="d-flex flex-column custom-card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="avatar">
              <span>{client[0]}</span>
            </div>
            <div className="client-info">
              <CardTitle tag="h5" className="client-name">
                {client}
              </CardTitle>
              <CardText className="client-title">{clientTitle}</CardText>
            </div>
          </div>
          <div className="skills-container" ref={skillsRef}>
            {Array.isArray(skills) && showMoreSkills ? (
              <span className="more-skills">...</span>
            ) : (
              skills.map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill}
                </span>
              ))
            )}
          </div>
          <div className="field-container">
            <span className="field-badge">{field}</span>
          </div>
          <div className="mt-auto d-flex justify-content-between">
            <i className="bi bi-file-earmark"></i>
            <Link to={`/project/edit/${id}`}>
              <i className="bi bi-pencil"></i>
            </Link>
            <i className="bi bi-person"></i>
            <i
              className="bi bi-trash"
              onClick={toggle}
              style={{ color: "red", cursor: "pointer" }}
            ></i>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this project?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CustomCard;
