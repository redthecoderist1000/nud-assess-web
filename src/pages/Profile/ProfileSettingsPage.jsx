import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sampleProfile from "../../assets/images/sample_profile.png";
import { userContext } from "../../App";
import Header from "./component/Header";
import Personal from "./component/Personal";
import Privacy from "./component/Privacy";
import Container from "@mui/material/Container";
import { supabase } from "../../helper/Supabase";
import { Alert, Snackbar } from "@mui/material";

const ProfileSettingsPage = () => {
  const [avatarUrl, setAvatarUrl] = useState(sampleProfile);
  const { setSnackbar } = useContext(userContext);

  return (
    <Container maxWidth="xl" className="my-5">
      <div className="bg-white border-b border-gray-200 pt-6 pb-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-0">
          Profile Setting
        </h1>
      </div>
      <Header avatarUrl={avatarUrl} />
      <div className="flex flex-col md:flex-row gap-5 mt-6">
        <div className="flex-1">
          <Personal />
        </div>
        <div className="flex-1">
          <Privacy />
        </div>
      </div>
    </Container>
  );
};

export default ProfileSettingsPage;
