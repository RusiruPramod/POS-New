import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signIn,
  signUp,
  logOut,
  onAuthChange,
  updateUserCredentials,
  resetPassword as resetPasswordService,
  sendVerification as sendVerificationService,
} from "../firebase/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await signIn(email, password);
      return res.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signup = async (email, password) => {
    setAuthError(null);
    try {
      const res = await signUp(email, password);
      return res.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await resetPasswordService(email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    setAuthError(null);
    try {
      await sendVerificationService();
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await logOut();
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updateAccount = async (credentials) => {
    setAuthError(null);
    try {
      await updateUserCredentials(credentials);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        setAuthError,
        login,
        signup,
        resetPassword,
        sendVerificationEmail,
        logout,
        updateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

