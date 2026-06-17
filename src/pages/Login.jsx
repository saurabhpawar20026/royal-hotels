import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaCrown, FaEnvelope, FaLock, FaUser, FaGoogle, FaApple, FaFacebookF,
  FaShieldAlt, FaRegEye, FaRegEyeSlash,
} from "react-icons/fa";
import { heroes, u } from "../data/images.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotify } from "../context/NotificationContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { notify } = useNotify();
  const adminHint = location.state?.admin === true;

  const [mode, setMode] = useState("signin");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: adminHint ? "admin@royalhotels.com" : "",
    password: "",
    confirm: "",
    remember: true,
  });

  useReveal("login");

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const profile = login({ email: form.email, name: mode === "signup" ? form.name : undefined });
    notify(
      `Welcome${profile.name ? `, ${profile.name}` : ""}!`,
      "success",
      profile.role === "admin" ? "Signed in to the Admin Dashboard." : "Your royal escape awaits."
    );
    navigate(profile.role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="login">
      <div className="login__inner">
        {/* Left — immersive brand panel */}
        <aside
          className="login__art"
          style={{ backgroundImage: `linear-gradient(120deg, rgba(10,9,8,0.55), rgba(10,9,8,0.82)), url(${u(heroes[0], 1400)})` }}
        >
          <div className="login__art-inner">
            <Link to="/" className="login__brand" aria-label="Royal Hotels home">
              <FaCrown />
              <span>Royal Hotels</span>
            </Link>
            <div className="login__art-copy">
              <span className="eyebrow">A World Reserved For You</span>
              <h2 className="serif">Step into a realm where every detail is crafted for the extraordinary.</h2>
              <p>Members enjoy private rates, curated experiences, and the keys to our finest suites.</p>
            </div>
            <div className="login__art-foot">
              <span>Est. 1998 · 12 Destinations · One Standard — Perfection</span>
            </div>
          </div>
        </aside>

        {/* Right — auth card */}
        <main className="login__panel reveal">
          <div className="login__card glass">
            <Link to="/" className="login__brand login__brand--mobile" aria-label="Royal Hotels home">
              <FaCrown />
              <span>Royal Hotels</span>
            </Link>

            <header className="login__head">
              <span className="eyebrow">{mode === "signin" ? "Welcome Back" : "Join The Circle"}</span>
              <h1 className="serif">{mode === "signin" ? "Sign in to your suite" : "Create your account"}</h1>
            </header>

            <div className="login__tabs" role="tablist" aria-label="Authentication mode">
              <button
                role="tab"
                aria-selected={mode === "signin"}
                className={mode === "signin" ? "on" : ""}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
              <button
                role="tab"
                aria-selected={mode === "signup"}
                className={mode === "signup" ? "on" : ""}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {adminHint && (
              <div className="login__admin-note">
                <FaShieldAlt />
                <span><strong>Admin area.</strong> Sign in to access the management dashboard.</span>
              </div>
            )}

            <form className="login__form" onSubmit={submit}>
              {mode === "signup" && (
                <label className="field login__field">
                  <span>Full Name</span>
                  <span className="login__input">
                    <FaUser />
                    <input
                      type="text"
                      placeholder="Aria Castellan"
                      value={form.name}
                      onChange={set("name")}
                      required
                      autoComplete="name"
                    />
                  </span>
                </label>
              )}

              <label className="field login__field">
                <span>Email Address</span>
                <span className="login__input">
                  <FaEnvelope />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                    autoComplete="email"
                  />
                </span>
              </label>

              <label className="field login__field">
                <span>Password</span>
                <span className="login__input">
                  <FaLock />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    className="login__eye"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </span>
              </label>

              {mode === "signup" && (
                <label className="field login__field">
                  <span>Confirm Password</span>
                  <span className="login__input">
                    <FaLock />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={set("confirm")}
                      required
                      autoComplete="new-password"
                    />
                  </span>
                </label>
              )}

              {mode === "signin" && (
                <div className="login__row">
                  <label className="login__remember">
                    <input type="checkbox" checked={form.remember} onChange={set("remember")} />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="login__forgot">Forgot password?</button>
                </div>
              )}

              <button type="submit" className="btn btn-gold btn-block btn-lg login__submit">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="login__hint">
              Tip: sign in with any email. Use an email starting with <strong>admin@</strong> for the Admin Dashboard.
            </p>

            <div className="login__divider"><span>or continue with</span></div>

            <div className="login__social">
              <button type="button" aria-label="Continue with Google"><FaGoogle /> Google</button>
              <button type="button" aria-label="Continue with Apple"><FaApple /> Apple</button>
              <button type="button" aria-label="Continue with Facebook"><FaFacebookF /> Facebook</button>
            </div>

            <p className="login__switch">
              {mode === "signin" ? "New to Royal Hotels? " : "Already have an account? "}
              <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                {mode === "signin" ? "Create an account" : "Sign in instead"}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
