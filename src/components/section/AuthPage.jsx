import React, { createContext, useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export const authContext = createContext();

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [token_hash, setTokenHash] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (token_hash && type) {
      setTokenHash(token_hash);
      setIsRegister(true);
    }
  }, []);

  return isRegister ? (
    <authContext.Provider value={setIsRegister}>
      <SignupPage token_hash={token_hash} />
    </authContext.Provider>
  ) : (
    <authContext.Provider value={setIsRegister}>
      <LoginPage />
    </authContext.Provider>
  );
}

export default AuthPage;
