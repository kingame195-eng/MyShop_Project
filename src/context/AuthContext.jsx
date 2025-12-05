import { createContext, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => successMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email || !password || !fullName) {
        throw new Error("Please fill in all required information");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now(),
        email,
        fullName,
        role: "user",
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setSuccessMessage("Registration successful! Please verify your email.");
      return { success: true, user: newUser };
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all required information");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "demo@example.com" && password === "123456") {
        const loggedUser = {
          id: 1,
          email,
          fullName: "Demo User",
          role: "user",
          isEmailVerified: true,
          token: "demo-jwt-token-" + Date.now(),
        };

        setUser(loggedUser);
        setSuccessMessage("Login successful!");
        return { success: true, user: loggedUser };
      } else {
        throw new Error("Email or password is incorrect");
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setSuccessMessage("Logout successful!");
  };

  const updateUser = (userData) => {
    setUser({
      ...user,
      ...userData,
    });
  };

  const requestReset = async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email) {
        throw new Error("Please enter email");
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        "Password reset email has been sent. Please check your inbox."
      );
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!data.token || !data.newPassword) {
        throw new Error("Invalid data");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Password has been changed successfully!");
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user email verified status
      setUser({ ...user, isEmailVerified: true });
      setSuccessMessage("Email verified successfully!");

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  const value = {
    user,
    isLoading,
    error,
    successMessage,
    register,
    login,
    logout,
    updateUser,
    requestReset,
    resetUserPassword,
    verifyEmail,
    isAuthenticated: !!user,
    userRole: user?.role || null,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
