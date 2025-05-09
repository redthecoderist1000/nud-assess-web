import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import loginImage from "../../assets/images/login_image.png";
import microsoftLogo from "../../assets/images/microsoftlogo.png";
import hideIcon from "../../assets/images/hide.png";
import unhideIcon from "../../assets/images/unhide.png";
import { motion } from "framer-motion";

import { supabase, userContext } from "../../App";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userCon = useContext(userContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    // correct na
    setError("");
    setIsLoading(true);
    console.log("Logging in...");

    // alert(email + password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.session == null) {
      // console.log("Error: " + error);
      alert("Error: " + error);
      setIsLoading(false);

      return;
    }

    // get user details
    console.log(data.user.id);

    await supabase
      .from("tbl_users")
      .select("*")
      .eq("id", data.user.id)
      .single()
      .then((data2) => {
        console.log(data2.data);

        userCon.setUser({
          ...userCon.user,
          email: data.user.email,
          user_id: data.user.id,
          suffix: data2.data.suffix,
          role: data2.data.role,
          f_name: data2.data.f_name,
          m_name: data2.data.m_name,
          l_name: data2.data.l_name,
        });
      });

    navigate("/dashboard");
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
          <form className="w-full max-w-md" onSubmit={handleLogin}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                  pattern="r'^[a-zA-Z0-9._%+-]+@(nu-dasma\.edu\.ph)$'"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mt-3">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-amber-400 text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <p className="text-red-500 text-sm mt-3">{error}</p>

            {/* Login Button */}
            <motion.button
              type="submit"
              // onClick={handleLogin}
              className={
                isLoading
                  ? "w-full mt-4 p-3 bg-[#969697] text-white rounded-md"
                  : "w-full mt-4 p-3 bg-[#35408E] text-white rounded-md"
              }
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Log in"}
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
                onClick={() => navigate("/signup")}
                className="text-amber-400 cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </motion.p>

            {/* Separator */}
            {/* <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-400">Or login with</span>
              <hr className="flex-grow border-gray-300" />
            </div> */}

            {/* Microsoft Login */}
            {/* <motion.button
              className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md hover:bg-[#35408E] hover:text-white transition-colors duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={microsoftLogo}
                alt="Microsoft Logo"
                className="w-5 h-5 mr-3"
              />
              Log in with Microsoft
            </motion.button> */}
          </form>
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
