import React from "react";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CenteredBox, CenteredCard } from "../components/CenterBoxLog";
import GradientBackground from "../components/GradientBackground";

import cap from "../assets/images/logos/cap.png";

// show the link sent successfully page
const ResetPwdLinkSent = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <CenteredBox>
        <CenteredCard>
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={cap}
                alt="small_logo"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <Typography
              sx={{ textAlign: "center" }}
              variant="h5"
              component="div"
            >
              <b></b> We sent you an email which contains a link to reset your
              password. <b></b>
            </Typography>{" "}
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <big>
                <Link
                  href="#"
                  onClick={() => navigate("/login")}
                  aria-label="Go Back to Login"
                >
                  Go Back to Login
                </Link>
              </big>
            </div>
          </CardContent>
        </CenteredCard>
      </CenteredBox>
      <GradientBackground />
    </>
  );
};

export default ResetPwdLinkSent;
