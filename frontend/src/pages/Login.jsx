import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import { useApp } from "../context/AppContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, setIsLoading } = useApp();
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);
      const { data } = response.data;

      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>📋 Task Manager</h1>
          <p>Kelola tugas Anda dengan mudah</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Masuk
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <ul>
            <li>Admin: admin@example.com / admin123</li>
            <li>User: john@example.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

