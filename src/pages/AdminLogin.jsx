import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/adminlogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      
      // User-friendly error messages
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (err.code === "auth/user-not-found") {
        setError("No admin account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later");
      } else {
        setError("Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail("");
        setResetMessage("");
      }, 3000);
    } catch (err) {
      console.error("Reset error:", err);
      
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to send reset email. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="admin-icon">👨‍💼</div>
            <h1>Admin Login</h1>
            <p>Access your dashboard</p>
          </div>

          {!showForgotPassword ? (
            // LOGIN FORM
            <form className="login-form" onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="admin@laundry.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            // FORGOT PASSWORD FORM
            <form className="login-form" onSubmit={handleForgotPassword}>
              {error && <div className="error-message">{error}</div>}
              {resetMessage && <div className="success-message">{resetMessage}</div>}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setShowForgotPassword(false);
                  setError("");
                  setResetMessage("");
                }}
              >
                Back to Login
              </button>
            </form>
          )}

          <div className="login-footer">
            <p>🔒 Secure admin access only</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;