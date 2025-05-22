import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import adminIcon from "../../assets/images/admin_icon.png";
import profilePic from "../../assets/images/sample_profile.png";
import dashboardIcon from "../../assets/images/dashboard_icon.png";
import quizManagementIcon from "../../assets/images/quizmanagement_icon.png";
import questionManagementIcon from "../../assets/images/questionmanagement_icon.png";
import classManagementIcon from "../../assets/images/classmanagement_icon.png";
import reportAnalyticsIcon from "../../assets/images/reportanalytics_icon.png";
import profileSettingIcon from "../../assets/images/profilesetting_icon.png";
import createQuizIcon from "../../assets/images/quizmanagementwhite_icon.png";
import { useContext } from "react";
import { userContext } from "../../App";

const NavBar = () => {
  const userCon = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const navItems =
    userCon.user.role == "Admin"
      ? [
          { to: "/dashboard", label: "Dashboard", icon: dashboardIcon },
          {
            to: "/dashboard/QuizManagement",
            label: "Quiz Management",
            icon: quizManagementIcon,
          },
          {
            to: "/dashboard/QuestionManagement",
            label: "Question Management",
            icon: questionManagementIcon,
          },
          {
            to: "/dashboard/ClassManagement",
            label: "My Classes",
            icon: classManagementIcon,
          },
          {
            to: "/dashboard/ReportAndAnalytics",
            label: "Report and Analytics",
            icon: reportAnalyticsIcon,
          },
          {
            to: "/dashboard/Administration",
            label: "Administration",
            icon: adminIcon,
          },
          {
            to: "/dashboard/ProfileSettings",
            label: "Profile Settings",
            icon: profileSettingIcon,
          },
        ]
      : [
          { to: "/dashboard", label: "Dashboard", icon: dashboardIcon },
          {
            to: "/dashboard/QuizManagement",
            label: "Quiz Management",
            icon: quizManagementIcon,
          },
          {
            to: "/dashboard/QuestionManagement",
            label: "Question Management",
            icon: questionManagementIcon,
          },
          {
            to: "/dashboard/ClassManagement",
            label: "My Classes",
            icon: classManagementIcon,
          },
          {
            to: "/dashboard/ReportAndAnalytics",
            label: "Report and Analytics",
            icon: reportAnalyticsIcon,
          },
          {
            to: "/dashboard/ProfileSettings",
            label: "Profile Settings",
            icon: profileSettingIcon,
          },
        ];

  return (
    <aside className="sidebar w-72 min-h-screen bg-[#DDE4F5] shadow-md p-6 flex-col hidden md:flex">
      {/* Logo Section */}
      <header className="mb-6 flex justify-center">
        <img src={logo} alt="Logo" className="logo w-40" />
      </header>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
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

      {/* Navigation Links */}
      <nav className="flex-1 space-y-4">
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon }, index) => (
            <li key={index}>
              <Link
                to={to}
                className={`sidebar-link flex items-center space-x-3 py-2 px-4 rounded-md transition-all duration-300 ${
                  location.pathname === to
                    ? "bg-[#2D3B87] text-white"
                    : "text-[#2D3B87] opacity-90 hover:bg-[#2D3B87] hover:text-white hover:rounded-md"
                }`}
              >
                <img src={icon} alt={`${label} Icon`} className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;
