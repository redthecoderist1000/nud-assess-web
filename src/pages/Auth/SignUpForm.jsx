import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useNavigate for redirection
import { motion } from "framer-motion";

import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";
import TermsDialog from "./components/TermsDialog";
import PolicyDialog from "./components/PolicyDialog";

function SignUpForm() {
  const location = useLocation();
  const { user, setUser, setSnackbar } = useContext(userContext);
  const [formData, setFormData] = useState({
    user_id: location.state.user_id,
    email: location.state.email,
    suffix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    department: "",
  });
  const [deptOption, setDeptOption] = useState([]);

  const [loading, setLoading] = useState(false);

  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // trim inputs
    formData.firstName = formData.firstName.trim();
    formData.middleName = formData.middleName.trim();
    formData.lastName = formData.lastName.trim();
    formData.suffix = formData.suffix.trim();
    formData.department = formData.department.trim();

    // Basic field validations
    if (formData.firstName == "") {
      setSnackbar({
        open: true,
        message: "First name is required.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (formData.lastName == "") {
      setSnackbar({
        open: true,
        message: "Last name is required.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (formData.department == "") {
      setSnackbar({
        open: true,
        message: "Please choose the department you belong.",
        severity: "error",
      });

      setLoading(false);
      return;
    }

    setLoading(true);

    let { data, error } = await supabase
      .from("tbl_users")
      .insert({
        id: formData.user_id,
        suffix: formData.suffix,
        f_name: titleCase(formData.firstName),
        m_name: titleCase(formData.middleName),
        l_name: titleCase(formData.lastName),
        email: formData.email,
        role: "Faculty",
        department_id: formData.department,
      })
      .select("*")
      .single();

    if (error) {
      setSnackbar({
        open: true,
        message: "Setup account unsuccessful",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    setUser({
      ...user,
      email: data.email,
      user_id: data.id,
      suffix: data.suffix,
      role: data.role,
      f_name: data.f_name,
      m_name: data.m_name,
      l_name: data.l_name,
      department_id: data.department_id,
    });
    setSnackbar({
      open: true,
      message: "Account setup successful",
      severity: "success",
    });
  };

  useEffect(() => {
    fetchDept();
  }, []);

  const fetchDept = async () => {
    const { data, error } = await supabase
      .from("tbl_department")
      .select("id, name");

    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch departments",
        severity: "error",
      });
      return;
    }
    setDeptOption(data);
  };

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-1/3 ">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Account Setup
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Finish you account creation by setting up your profile.
        </motion.p>
        <Stack rowGap={2}>
          <Stack direction={"row"} spacing={2}>
            {/* <TextField
              fullWidth
              label="Prefix"
              name="suffix"
              size="small"
              value={formData.suffix}
              onChange={handleChange}
              variant="outlined"
            /> */}
            <FormControl size="small" fullWidth>
              <InputLabel id="suffix_label">Preffix</InputLabel>
              <Select
                label="Preffix"
                labelId="suffix_label"
                id="suffix_select"
                name="suffix"
                onChange={handleChange}
              >
                <MenuItem value={0} disabled>
                  --Select Preffix--
                </MenuItem>
                <MenuItem value="Jr">Jr.</MenuItem>
                <MenuItem value="Sr">Sr.</MenuItem>
                <MenuItem value="I">I</MenuItem>
                <MenuItem value="II">II</MenuItem>
                <MenuItem value="III">III</MenuItem>
                <MenuItem value="IV">IV</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              fullWidth
              label="First Name"
              name="firstName"
              size="small"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
            />
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              size="small"
              value={formData.middleName}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              name="lastName"
              size="small"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
            />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel id="dept_label">Department</InputLabel>
            <Select
              label="Department"
              labelId="dept_label"
              id="dept_select"
              defaultValue={0}
              name="department"
              onChange={handleChange}
            >
              <MenuItem value={0} disabled>
                --Select Department--
              </MenuItem>
              {/* <MenuItem value="06a33d27-1c14-46b4-ade3-4be2d0a0c20a">
                Information Technology Department
              </MenuItem> */}
              {deptOption.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Terms and Privacy Policies */}

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="medium"
            sx={{ bgcolor: "#35408E", color: "white" }}
          >
            Continue
          </Button>
        </Stack>
      </form>

      <TermsDialog open={terms} onClose={() => setTerms(false)} />
      <PolicyDialog open={privacy} onClose={() => setPrivacy(false)} />
    </>
  );
}

export default SignUpForm;
