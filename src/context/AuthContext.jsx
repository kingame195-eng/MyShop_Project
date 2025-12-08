import { createContext, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// Import API function
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to fetch API
const fetchAPI = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

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
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
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

      // ✅ CORRECT: Call Backend API to save user to PostgreSQL
      const response = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          confirmPassword: password,
        }),
      });

      // ✅ CORRECT: Save user + token to localStorage
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        token: response.token,
      });

      setSuccessMessage("Registration successful!");
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      return { success: false };
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

      // ✅ CORRECT: Call Backend API to authenticate user
      const response = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // ✅ CORRECT: Save user + token to localStorage
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        token: response.token,
      });

      setSuccessMessage("Login successful!");
      return { success: true, user: response.user };
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

  // ❌ NOT IMPLEMENTED YET - Password reset không có backend support
  // const requestReset = async (email) => {
  //   setIsLoading(true);
  //   setError(null);
  //   setSuccessMessage(null);
  //
  //   try {
  //     if (!email) {
  //       throw new Error("Please enter email");
  //     }
  //     // TODO: Gọi backend /api/auth/forgot-password
  //     // const response = await fetchAPI("/auth/forgot-password", {
  //     //   method: "POST",
  //     //   body: JSON.stringify({ email }),
  //     // });
  //     setSuccessMessage("Password reset email has been sent. Please check your inbox.");
  //     return { success: true };
  //   } catch (error) {
  //     setError(error.message);
  //     return { success: false, error: error.message };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ❌ NOT IMPLEMENTED YET - Reset password không có backend support
  // const resetUserPassword = async (data) => {
  //   setIsLoading(true);
  //   setError(null);
  //   setSuccessMessage(null);
  //
  //   try {
  //     if (!data.token || !data.newPassword) {
  //       throw new Error("Invalid data");
  //     }
  //     // TODO: Gọi backend /api/auth/reset-password
  //     // const response = await fetchAPI("/auth/reset-password", {
  //     //   method: "POST",
  //     //   body: JSON.stringify(data),
  //     // });
  //     setSuccessMessage("Password has been changed successfully!");
  //     return { success: true };
  //   } catch (error) {
  //     setError(error.message);
  //     return { success: false, error: error.message };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // ❌ NOT IMPLEMENTED YET - Email verification không có backend support
  // const verifyEmail = async (token) => {
  //   setIsLoading(true);
  //   setError(null);
  //
  //   try {
  //     // TODO: Gọi backend /api/auth/verify-email
  //     // const response = await fetchAPI("/auth/verify-email", {
  //     //   method: "POST",
  //     //   body: JSON.stringify({ token }),
  //     // });
  //     setUser({ ...user, isEmailVerified: true });
  //     setSuccessMessage("Email verified successfully!");
  //     return { success: true };
  //   } catch (error) {
  //     setError(error.message);
  //     return { success: false, error: error.message };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const value = {
    user,
    isLoading,
    error,
    successMessage,
    register,
    login,
    logout,
    updateUser,
    // ❌ NOT IMPLEMENTED - requestReset, resetUserPassword, verifyEmail
    // requestReset,
    // resetUserPassword,
    // verifyEmail,
    isAuthenticated: !!user,
    userRole: user?.role || null,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
