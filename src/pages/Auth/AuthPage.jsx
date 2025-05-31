import { createContext, useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export const authContext = createContext();

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);

  return isRegister ? (
    <authContext.Provider value={setIsRegister}>
      <SignupPage />
    </authContext.Provider>
  ) : (
    <authContext.Provider value={setIsRegister}>
      <LoginPage />
    </authContext.Provider>
  );
}

export default AuthPage;
