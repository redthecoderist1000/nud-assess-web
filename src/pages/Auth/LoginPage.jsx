import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/login_image.png";
import hideIcon from "../../assets/images/hide.png";
import unhideIcon from "../../assets/images/unhide.png";
import { motion } from "framer-motion";

import { userContext } from "../../App";
import { supabase } from "../../helper/Supabase";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userCon = useContext(userContext);

  const [signUp, setSignUp] = useState(false);
  const [formSignUp, setFormSignUp] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChangeSignUpForm = (e) => {
    setFormSignUp({ ...formSignUp, [e.target.name]: e.target.value });
  };

  const sendConfirmation = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const domain = formSignUp.email.split("@")[1];
    // uncomment on final
    // if (domain != "nu-dasma.edu.ph") {
    //   setError("Please use your valid NU email");
    // setIsLoading(false);
    //   return;
    // }
    if (formSignUp.password != formSignUp.cpassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    (async () => {
      const { data, error } = await supabase.auth.signUp({
        email: formSignUp.email,
        password: formSignUp.password,
      });

      if (error) {
        // console.log("Error in sign up:", signUpRes.error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        setError("otp was successfully sent to:", formSignUp.email);
        navigate("/signup-otp", { state: { email: formSignUp.email } });
      }
      setIsLoading(false);
    })();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // correct na
    setError("");
    setIsLoading(true);

    // alert(email + password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      // console.log("Error: " + error);
      setError(error.message);
      setIsLoading(false);

      return;
    }

    await supabase
      .from("tbl_users")
      .select("*")
      .eq("id", data.user.id)
      .single()
      .then((data2) => {
        userCon.setUser({
          ...userCon.user,
          email: data.user.email,
          user_id: data.user.id,
          suffix: data2.data.suffix,
          role: data2.data.role,
          f_name: data2.data.f_name,
          m_name: data2.data.m_name,
          l_name: data2.data.l_name,
          department_id: data2.data.department_id,
          allow_ai: data2.data.allow_ai,
        });
      });

    // navigate("/dashboard");
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col bg-white relative"
    >
      <motion.header
        className="absolute top-6 left-10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt="NUD Assess Logo" className="h-10" />
      </motion.header>

      <div className="flex flex-grow items-center justify-center p-10">
        <motion.div
          className="w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {signUp ? (
            <form className="w-full max-w-md" onSubmit={sendConfirmation}>
              {/* sign up form */}
              <motion.h1
                className="text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sign Up
              </motion.h1>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Enter your valid NU faculty email to recieve a confirmation link
              </motion.p>
              <div className="space-y-4">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type="email"
                    id="email_signUp"
                    name="email"
                    onChange={handleChangeSignUpForm}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    // pattern="r'^[a-zA-Z0-9._%+-]+@(nu-dasma\.edu\.ph)$'"
                    // pattern="^[a-zA-Z0-9._%+-]+@nu-dasma\\.edu\\.ph$"
                    required
                  />
                  <label
                    htmlFor="email_signUp"
                    className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Email
                  </label>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handleChangeSignUpForm}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                    placeholder=" "
                    required
                    minLength={6}
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Password
                  </label>
                  <img
                    src={showPassword ? hideIcon : unhideIcon}
                    alt="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  />
                </motion.div>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type={showCPassword ? "text" : "password"}
                    name="cpassword"
                    id="c_password"
                    onChange={handleChangeSignUpForm}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="c_password"
                    className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Confirm Password
                  </label>
                  <img
                    src={showCPassword ? hideIcon : unhideIcon}
                    alt="Toggle password visibility"
                    onClick={() => setShowCPassword(!showCPassword)}
                    className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  />
                </motion.div>
              </div>
              <p className="text-red-500 text-sm mt-3">{error}</p>

              {/* Send Confirmation Button */}
              <motion.button
                type="submit"
                className="w-full mt-4 p-3 bg-[#35408E] text-white rounded-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Send Confirmation"}
              </motion.button>
              {/* Login Link */}
              <motion.p
                className="text-center mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Already have an account?{" "}
                <span
                  onClick={() => setSignUp(false)}
                  className="text-amber-400 cursor-pointer hover:underline"
                >
                  Log In
                </span>
              </motion.p>
            </form>
          ) : (
            <form className="w-full max-w-md" onSubmit={handleLogin}>
              {/* login form */}
              <motion.h1
                className="text-4xl font-bold mb-3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Login
              </motion.h1>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Login to access your NUD Assess account
              </motion.p>

              <div className="space-y-4">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type="email"
                    id="email"
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    // pattern="r'^[a-zA-Z0-9._%+-]+@(nu-dasma\.edu\.ph)$'"
                    // pattern="^[a-zA-Z0-9._%+-]+@nu-dasma\\.edu\\.ph$"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Email
                  </label>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pr-10"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-lg text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                  >
                    Password
                  </label>
                  <img
                    src={showPassword ? hideIcon : unhideIcon}
                    alt="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  />
                </motion.div>
              </div>

              <p className="text-red-500 text-sm mt-3">{error}</p>

              {/* Login Button */}
              <motion.button
                type="submit"
                className={
                  isLoading
                    ? "w-full mt-4 p-3 bg-[#969697] text-white rounded-md"
                    : "w-full mt-4 p-3 bg-[#35408E] text-white rounded-md"
                }
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Log in"}
              </motion.button>

              {/* Signup Link */}
              <motion.p
                className="text-center mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Don't have an account?{" "}
                <span
                  onClick={() => setSignUp(true)}
                  className="text-amber-400 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </motion.p>
            </form>
          )}
        </motion.div>

        <motion.div
          className="w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-3/4 h-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
