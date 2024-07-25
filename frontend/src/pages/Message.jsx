import React, { useEffect, useRef, useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
  MDBCardHeader,
  MDBCardFooter,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Button as MUIButton } from '@mui/material';
import { Button, Flex, List, Input, Modal, Avatar } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Outlet, useActionData } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import { Container, Card, CardText, CardTitle } from "reactstrap";
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import '../assets/scss/FullLayout.css';//make sure import this
import '../assets/scss/Message.css'
import PersonalCard from '../components/PersonalCard';
import ChatPersonalCard from '../components/ChatPersonalCard';

const Message = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // personal card modal
  const [isPersonalCardVisible, setIsPersonalCardVisible] = useState(false);
  // new chat select person card modal
  const [isChatPersonalCardVisible, setIsChatPersonalCardVisible] = useState(false);
  // edit channel name
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState('Channel Name');

  const handlePersonalCardOk = () => {
    setIsPersonalCardVisible(false);
  }

  const handlePersonalCardCancel = () => {
    setIsPersonalCardVisible(false);
  }

  // for chat select modal
  const handleChatPersonalCardOk = () => {
    setIsChatPersonalCardVisible(false);
  }
  const handleChatPersonalCardCancel = () => {
    setIsChatPersonalCardVisible(false);
  }

  // for channel name edit
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setChannelName(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea">
          <div className="d-lg-none headerMd">
            {/********Header**********/}
            <Header />
          </div>
          <div className="d-none d-lg-block headerLg">
            {/********Header**********/}
            <Header />
          </div>
          {/********Middle Content**********/}
          <Container className="p-4 wrapper" fluid>
            {/* add code here */}
            
            <Card id="scrollableDiv2">
            <div className="topContainer">
              <Button
                type="primary" 
                className="list-item-button"
                style={{marginLeft: '18px'}}
              >
                All Channel
              </Button>
              <Button
                type="primary" 
                className="list-item-button"
                style={{marginLeft: '18px'}}
                onClick={() => setIsChatPersonalCardVisible(true)}
              >
                +  New Channel
              </Button>
            </div>
              <Card id="scrollableDiv2">
                {/* Channel name. When it's group chat, show invite & leave button*/}
                <CardTitle>
                  <div className="channel-title">
                    {isEditing ? (
                      <Input
                        value={channelName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        autoFocus
                      />
                    ) : (
                      <p>
                        <strong>{channelName}</strong>
                        <EditOutlined className="edit-icon" onClick={handleEditClick} />
                      </p>
                    )}
                    <div className="buttons">
                      <Button className="invite-button">+ Invite</Button>
                      <Button className="leave-button">Leave</Button>
                    </div>
                  </div>
                </CardTitle>
                {/* message template */}
                <li className="d-flex align-items-center mb-4">
                  <Avatar src={''} size={48} className="avatar" />
                  <MDBCard style={{ flexGrow: 1 }}>
                    <MDBCardHeader className="d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0">Brad Pitt</p>
                      <p className="text-muted small mb-0">
                        <MDBIcon far icon="clock" /> 12 mins ago
                      </p>
                    </MDBCardHeader>
                    <MDBCardBody>
                      <p className="mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua.
                      </p>
                    </MDBCardBody>
                  </MDBCard>
                </li>
                {/* personal card template */}
                <li className="d-flex align-items-center mb-4">
                  <Avatar src={''} size={48} className="avatar" />
                  <MDBCard style={{ flexGrow: 1 }}>
                    <MDBCardHeader className="d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0">Brad Pitt</p>
                      <p className="text-muted small mb-0">
                        <MDBIcon far icon="clock" /> 12 mins ago
                      </p>
                    </MDBCardHeader>
                    <MDBCardBody style={{ padding: '16px', width: '40%' }}>
                      <div style={{
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        padding: '16px',
                        backgroundColor: '#e0f7fa',
                      }}>
                        <p className="mb-2" style={{ fontStyle: 'italic', color: '#555' }}>
                          We recommend you connect with this user:
                        </p>
                        <hr style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
                        <p className="mb-1" style={{ fontWeight: 'bold' }}>
                          <strong>Name:</strong> <span style={{ fontWeight: 'normal' }}>xxx</span>
                        </p>
                        <p className="mb-0" style={{ fontWeight: 'bold' }}>
                          <strong>Email:</strong> <span style={{ fontWeight: 'normal' }}>xxx@example.com</span>
                        </p>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </li>
                <List
                  loading={loading}
                  dataSource={filteredData}
                  renderItem={(item) => (
                    <List.Item className="list-item" key={item.userId}>
                      <List.Item.Meta style={{paddingLeft: "8px"}}

                        title={
                          <div className="list-item-meta-title">
                            <span className="list-item-meta-name" style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.title}</span>
                          </div>
                        }
                        description={
                          <div className="list-item-meta-description">
                            <div className="list-item-meta-id">Client: {item.clientName}</div>
                            <div className="list-item-meta-email">Client Email: {item.clientEmail}</div>
                            <div className="list-item-meta-field">Field: {item.field}</div>
                          </div>
                        }
                      />
                      <Button type="primary" className="list-item-button">Assign</Button>
                    </List.Item>
                  )}
                />
              </Card>


              <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                  alt="avatar 3"
                  style={{ width: "40px", height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput2"
                  placeholder="Type message"
                />
                <a className="ms-1 text-muted" href="#!">
                  <MDBIcon fas icon="paperclip" />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <MDBIcon fas icon="smile" />
                </a>
                <a className="ms-3" href="#!">
                  <MDBIcon fas icon="paper-plane" />
                </a>
                <IconButton
                  className="circle-buttonshare"
                  onClick={() => setIsPersonalCardVisible(true)}
                >
                  <ShareIcon />
                </IconButton>
              </div>
            </Card>
          </Container>
        </div>
      </div>

      {/* share personal card */}
      <PersonalCard
        visible={isPersonalCardVisible}
        onOk={handlePersonalCardOk}
        onCancel={handlePersonalCardCancel}
        // refreshData={loadMessageData} // update function
      >

      </PersonalCard>

      {/* chat selection personal card */}
      <ChatPersonalCard
        visible={isChatPersonalCardVisible}
        onOk={handleChatPersonalCardOk}
        onCancel={handleChatPersonalCardCancel}
        // refreshData={loadMessageData} // update function
      >

      </ChatPersonalCard>
    </main>
  );
};

export default Message;
