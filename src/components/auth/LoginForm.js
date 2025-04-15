/** @format */

import React, { useState } from "react";
import { signIn } from "../../services/auth";

// Mock navigation function for testing
const mockNavigate = (path) => {
  console.log(`Navigating to: ${path}`);
};

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (validateForm()) {
      try {
        await signIn(formData.email, formData.password);
        mockNavigate("/dashboard");
      } catch (error) {
        setLoginError(error.message || "Invalid credentials");
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Sign In</h2>
      {loginError && <div className="error-message">{loginError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
      <div className="form-footer">
        <p>
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
