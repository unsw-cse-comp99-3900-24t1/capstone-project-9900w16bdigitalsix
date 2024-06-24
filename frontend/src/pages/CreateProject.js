// CreateProject.js
import React from 'react';
import { Container } from 'reactstrap';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import ProjectForm from '../components/ProjectForm';

const contentAreaStyle = {
  marginTop: '56px', // Adjust this value to match the Header height
  // padding: '16px', // Optional padding for the content area
};

const CreateProject = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea" style={contentAreaStyle}>
          {/********Header**********/}
          <Header />
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            <h3>Create a new project</h3>
            <ProjectForm />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default CreateProject;
