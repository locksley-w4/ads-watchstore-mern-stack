import React, { createContext, useEffect, useId, useState } from "react";
import CryptoJS from "crypto-js";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

// localStorage.setItem("userCredentials", JSON.stringify({}));
// localStorage.setItem("usersData", JSON.stringify({}));

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthError, setIsAuthError] = useState(null);
  const [authErrorMsg, setAuthErrorMsg] = useState(null);
  const [user, setUser] = useState({});
  // const [id, setId] = useState(null);

  function clearAuthError() {
    setIsAuthError(false);
    setAuthErrorMsg("");
  }

  useEffect(() => {    
    setIsAuth(!!sessionStorage.getItem("accessToken"));
    // const _id = localStorage.getItem("userId");
    // setId(_id !== "undefined" ? _id : null);
  }, []);

  async function logout() {
    try {
      const response = await api.post("/auth/logout");
      setIsAuth(false);
      sessionStorage.removeItem("accessToken");      
      sessionStorage.removeItem("user");
      // await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    }
  }

  async function login(creds) {
    // input: {login, password}
    setIsAuthLoading(true);
    try {
      if (!creds.login || !creds.password)
        throw new Error("Enter your login and password.");

      const {
        data: { accessToken, user },
        status,
      } = await api.post("/auth/login", creds);

      setIsAuthLoading(false);

      if (accessToken && status.toString().startsWith("2")) {
        setIsAuth(true);
        setIsAuthError(false);
        setAuthErrorMsg(null);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }

      // if (String(userData.password) === String(creds.password)) {
      //   setIsAuth(true);
      //   setIsAuthLoading(false);
      //   setIsAuthError(false);
      //   setAuthErrorMsg(null);
      //   localStorage.setItem("isAuth", "true");
      //   localStorage.setItem("userId", userData.userId);
      //   setId(userData.userId);
      // } else if (userData) throw new Error("Incorrect password.");
      // else throw new Error("Authentication error. Please, try again.");
    } catch (er) {
      console.error(er);
      setIsAuthLoading(false);
      setIsAuthError(true);
      if (er.response?.status === 401 ?? 500)
        setAuthErrorMsg("Wrong credentials");
      else setAuthErrorMsg(er.response?.data?.message ?? "Server error");
    }
  }
  async function register({ email, password, fullName, phoneNumber }) {
    // input: {login, password}
    setIsAuthLoading(true);
    try {
      if ((!email || !password || !email, !fullName, !phoneNumber))
        throw new Error("Enter new login and password.");

      const {
        data: { accessToken, user },
        status,
      } = await api.post("/auth/register", {
        email,
        password,
        fullName,
        phoneNumber,
      });

      setIsAuthLoading(false);

      if (accessToken && status.toString().startsWith("2")) {
        setIsAuth(true);
        setIsAuthError(false);
        setAuthErrorMsg(null);
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
      // throw new Error(
      //   "User already exists. Please login or choose different login."
      // );
    } catch (er) {
      console.error(er);
      setIsAuthLoading(false);
      setIsAuthError(true);
      if (er.response?.status === 401) setAuthErrorMsg("Wrong credentials");
      else setAuthErrorMsg(er.response?.data?.message ?? "Server error");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isAuthLoading,
        isAuthError,
        authErrorMsg,
        user,
        setUser,
        // userId: id,
        login,
        logout,
        register,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
