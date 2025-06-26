import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import adminIcon from "../assets/images/admin_icon.png";
import profilePic from "../assets/images/sample_profile.png";
import dashboardIcon from "../assets/images/dashboard_icon.png";
import quizManagementIcon from "../assets/images/quizmanagement_icon.png";
import questionManagementIcon from "../assets/images/questionmanagement_icon.png";
import classManagementIcon from "../assets/images/classmanagement_icon.png";
import reportAnalyticsIcon from "../assets/images/reportanalytics_icon.png";
import profileSettingIcon from "../assets/images/profilesetting_icon.png";
import { useContext, useState } from "react";
import { userContext } from "../App";

import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: "#DDE4F5",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  padding: "10px",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#DDE4F5",
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const NavBar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const userCon = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const handleDrawer = () => {
    setOpen(!open);
  };

  const navItems =
    userCon.user.role == "Admin"
      ? [
          { to: "/", label: "Dashboard", icon: dashboardIcon },
          {
            to: "/QuizManagement",
            label: "Quizzes",
            icon: quizManagementIcon,
          },
          {
            to: "/QuestionManagement",
            label: "Questions",
            icon: questionManagementIcon,
          },
          {
            to: "/ClassManagement",
            label: "My Classes",
            icon: classManagementIcon,
          },
          {
            to: "/ReportAndAnalytics",
            label: "Report and Analytics",
            icon: reportAnalyticsIcon,
          },
          {
            to: "/Administration",
            label: "Administration",
            icon: adminIcon,
          },
          {
            to: "/ProfileSettings",
            label: "Profile Settings",
            icon: profileSettingIcon,
          },
        ]
      : [
          { to: "/", label: "Dashboard", icon: dashboardIcon },
          {
            to: "/QuizManagement",
            label: "Quizzes",
            icon: quizManagementIcon,
          },
          {
            to: "/QuestionManagement",
            label: "Questions",
            icon: questionManagementIcon,
          },
          {
            to: "/ClassManagement",
            label: "My Classes",
            icon: classManagementIcon,
          },
          {
            to: "/ReportAndAnalytics",
            label: "Report and Analytics",
            icon: reportAnalyticsIcon,
          },
          {
            to: "/ProfileSettings",
            label: "Profile Settings",
            icon: profileSettingIcon,
          },
        ];

  return (
    <Box>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawer}>
            {!open ? <MenuRoundedIcon /> : <ChevronLeftRoundedIcon />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        {/* Logo sectirn */}
        <header className="flex justify-center mt-5">
          <img src={logo} alt="Logo" className="" />
        </header>
        {/* Profile Section */}
        {open ? (
          <div className="flex flex-col items-center mb-5">
            <img
              src={profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold text-blue-900 mt-2">
              {userCon.user.f_name + " " + userCon.user.l_name}
            </h2>
            <p className="text-gray-500">{userCon.user.role}</p>
          </div>
        ) : (
          <></>
        )}
        <List>
          {navItems.map((data, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: "block", mb: 1 }}
            >
              <Link
                to={data.to}
                className={`sidebar-link flex items-center ${open ? "rounded-md" : ""} space-x-3 py-2 px-4 transition-all duration-300 ${
                  location.pathname === data.to
                    ? "bg-[#2D3B87] text-white"
                    : "text-[#2D3B87] opacity-90 hover:bg-[#2D3B87] hover:text-white"
                }`}
              >
                <img
                  src={data.icon}
                  alt={`${data.label} Icon`}
                  className="w-5 h-5"
                />
                {open ? <span>{data.label}</span> : <></>}
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default NavBar;
