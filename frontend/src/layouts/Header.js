import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import { ReactComponent as LogoWhite } from "../assets/images/logos/xtremelogowhite.svg";
import cap from "../assets/images/logos/cap_white.png";
import user1 from "../assets/images/users/user1.jpg";
import { apiCall, fileToDataUrl } from '../helper';
import MessageAlert from '../components/MessageAlert';
import { Avatar } from '@mui/material';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [snackbarContent, setSnackbarContent] = useState('');

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await apiCall('GET', `v1/user/profile/${userId}`, null, localStorage.getItem('token'), true);
        if (response) {
          const imagePath = response.avatarURL; 
          if (imagePath) {
            try {
              const imageResponse = await fetch(imagePath);
              if (!imageResponse.ok) {
                  throw new Error('Failed to fetch image');
              }
              const imageBlob = await imageResponse.blob();
              const imageFile = new File([imageBlob], "avatar.png", { type: imageBlob.type });
              const imageDataUrl = await fileToDataUrl(imageFile);
              setAvatar(imageDataUrl);
            } catch (imageError) {
              console.error('Failed to fetch image:', imageError);
              setAvatar(null);
            }
          } else {
            setAvatar(null);
          }
        } else {
          setSnackbarContent('Failed to fetch user data');
          setAlertType('error');
          setAlertOpen(true);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setSnackbarContent('Failed to fetch user data');
        setAlertType('error');
        setAlertOpen(true);
      }
    };

    fetchUserData();
  }, []);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  return (
    <Navbar color="primary" dark expand="md" className="bg-gradient">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          {/* <LogoWhite /> */}
          <img src={cap} alt="small_logo" style={{ width: '30px', height: '30px' }}/>
        </NavbarBrand>
        <Button
          color="primary"
          className=" d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/project/allproject" className="nav-link">
              All Project
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/project/myproject" className="nav-link">
              My Project
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </NavItem>
        </Nav>
        <Nav>
          <Link to="/notification" className="nav-link">
            <div className="notification-icon">
              <i className="bi bi-bell-fill"></i>
            </div>
          </Link>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="transparent">
            {/* avatar */}
            {/* <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img> */}
            <Avatar
                src={avatar}
                alt="Profile"
                sx={{ width: 30, height: 30 }}
            />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem
            href="/profile">
              Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem
            href="/login">
              Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
      <MessageAlert
        open={alertOpen}
        alertType={alertType}
        handleClose={handleAlertClose}
        snackbarContent={snackbarContent}
      />
    </Navbar>
  );
};

export default Header;