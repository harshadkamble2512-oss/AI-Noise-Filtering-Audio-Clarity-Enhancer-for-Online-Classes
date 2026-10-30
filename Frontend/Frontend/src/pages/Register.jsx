import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="logo">
          AI Classroom
        </Link>

        <h1>Create Account</h1>

        <p>Join your AI-powered online classroom.</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            minLength={8}
            required
          />

          <label>Account Type</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;