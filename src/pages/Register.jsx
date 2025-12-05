import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  validateRegisterForm,
  validatePassword,
  sanitizeInput,
} from "../utils/validators";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State cho password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho password strength
  const [passwordStrength, setPasswordStrength] = useState("");

  // Get register function
  const { register, isLoading, error } = useAuth();

  // Get navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      setPasswordStrength(validation.strength);
    } else {
      setPasswordStrength("");
    }
  }, [formData.password]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "#4caf50";
      case "medium":
        return "#ff9800";
      case "weak":
        return "#f44336";
      default:
        return "#ddd";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate form
    const validation = validateRegisterForm(formData);

    if (!validation.isValid) {
      // Hiển thị errors cho từng field
      setFieldErrors(validation.errors || {});
      return;
    }

    const sanitizedData = {
      fullName: sanitizeInput(formData.fullName),
      email: sanitizeInput(formData.email),
      password: formData.password, 
    };
  };
}
