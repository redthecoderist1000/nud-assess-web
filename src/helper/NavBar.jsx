import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import logo_icon from "../assets/images/logo_icon.png";
import adminIcon from "../assets/images/admin_icon.png";
import dashboardIcon from "../assets/images/dashboard_icon.png";
import quizManagementIcon from "../assets/images/quizmanagement_icon.png";
import questionManagementIcon from "../assets/images/questionmanagement_icon.png";
import classManagementIcon from "../assets/images/classmanagement_icon.png";
import reportAnalyticsIcon from "../assets/images/reportanalytics_icon.png";
import profileSettingIcon from "../assets/images/profilesetting_icon.png";
import { useContext, useState } from "react";
import { userContext } from "../App";

import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutDialog from "../pages/Profile/component/LogoutDialog";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

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
  padding: "5px",
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
  const [open, setOpen] = useState(true);
  const [logout, setLogout] = useState(false);

  const userCon = useContext(userContext);
  const location = useLocation(); // Get the current route

  const handleDrawer = () => {
    setOpen(!open);
  };

  const baseNavItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: <DashboardRoundedIcon fontSize="small" />,
    },
    {
      to: "/quizzes",
      label: "Quizzes",
      icon: <FormatListNumberedRoundedIcon fontSize="small" />,
    },
    {
      to: "/questions",
      label: "Questions",
      icon: <AssignmentRoundedIcon fontSize="small" />,
    },
    {
      to: "/classes",
      label: "My Classes",
      icon: <GroupRoundedIcon fontSize="small" />,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: <AnalyticsRoundedIcon fontSize="small" />,
    },
    {
      to: "/profile",
      label: "Profile Settings",
      icon: <ManageAccountsRoundedIcon fontSize="small" />,
    },
  ];

  let navItems = baseNavItems;

  if (userCon.user.role === "Admin") {
    navItems = [
      ...baseNavItems,
      {
        to: "/admin",
        label: "Administrator",
        icon: <AdminPanelSettingsRoundedIcon fontSize="small" />,
      },
      {
        to: "/profile",
        label: "Profile Settings",
        icon: <ManageAccountsRoundedIcon fontSize="small" />,
      },
    ];
  } else if (userCon.user.role === "SuperAdmin") {
    navItems = [
      {
        to: "/superadmin",
        label: "Super Admin Panel",
        icon: <SecurityRoundedIcon fontSize="small" />,
      },
      {
        to: "/superadmin/profile",
        label: "Profile Settings",
        icon: <ManageAccountsRoundedIcon fontSize="small" />,
      },
    ];
  }

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
        <header className="flex justify-center mt-5 p-2">
          <img src={open ? logo : logo_icon} alt="Logo" className="" />
        </header>
        {/* Profile Section */}
        {open ? (
          <div className="flex flex-col items-center mb-5">
            <Avatar sx={{ width: 80, height: 80 }} />

            <h2 className="text-lg font-semibold text-blue-900 mt-2">
              {userCon.user.f_name + " " + userCon.user.l_name}
            </h2>
            <p className="text-gray-500">{userCon.user.role}</p>
          </div>
        ) : (
          <></>
        )}
        <Stack justifyContent="space-between" sx={{ height: "100%" }} gap={2}>
          <List>
            {navItems.map((data, index) => (
              <Tooltip
                key={index}
                title={!open && data.label}
                placement="right"
                arrow
              >
                <ListItem disablePadding sx={{ display: "block", mb: 1 }} dense>
                  <Link
                    to={data.to}
                    className={`sidebar-link flex items-center rounded-md space-x-3 py-2 px-4 transition-all duration-300 ${
                      location.pathname === data.to
                        ? "bg-[#2D3B87] text-white"
                        : "text-[#2D3B87] opacity-90 hover:bg-[#2D3B87] hover:text-white"
                    }`}
                  >
                    {data.icon}
                    {open && (
                      <Typography fontWeight={600}>{data.label}</Typography>
                    )}
                  </Link>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          {open ? (
            <Button
              color="error"
              variant="contained"
              fullWidth
              disableElevation
              onClick={() => setLogout(true)}
              startIcon={<LogoutRoundedIcon />}
            >
              Sign Out
            </Button>
          ) : (
            <Tooltip title="Sign Out" placement="right" arrow>
              <IconButton color="error" onClick={() => setLogout(true)}>
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Drawer>

      <LogoutDialog open={logout} onClose={() => setLogout(false)} />
    </Box>
  );
};

export default NavBar;
