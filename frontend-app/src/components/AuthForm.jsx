import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function AuthForm({ role }) {

  const [mode, setMode] = useState("signin");

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({
      role,
      mode,
      ...form,
    });
  };

  return (
    <div className="auth-card">

      <div className="auth-tabs">

        <button
          className={
            mode === "signin"
              ? "active"
              : ""
          }
          onClick={() =>
            setMode("signin")
          }
        >
          Sign In
        </button>

        <button
          className={
            mode === "signup"
              ? "active"
              : ""
          }
          onClick={() =>
            setMode("signup")
          }
        >
          Create Account
        </button>

      </div>


      <div className="auth-heading">

        <h2>
          {mode === "signin"
            ? `Sign in as ${role}`
            : `Create ${role} account`}
        </h2>

        <p>
          {mode === "signin"
            ? "Enter your credentials to continue."
            : "Create your campus account to get started."}
        </p>

      </div>


      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >

        {mode === "signup" && (
          <div className="form-field">

            <label>
              Full name
            </label>

            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>
        )}


        <div className="form-field">

          <label>
            Register number / Email
          </label>

          <input
            name="email"
            type="text"
            placeholder="Enter your register number or email"
            value={form.email}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-field">

          <label>
            Password
          </label>

          <div className="password-field">

            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>

          </div>

        </div>


        {mode === "signup" && (
          <div className="form-field">

            <label>
              Confirm password
            </label>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={
                form.confirmPassword
              }
              onChange={handleChange}
              required
            />

          </div>
        )}


        {mode === "signin" && (
          <div className="auth-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button type="button">
              Forgot password?
            </button>

          </div>
        )}


        <button
          className="auth-submit"
          type="submit"
        >
          {mode === "signin"
            ? "Sign In"
            : "Create Account"}

          <ArrowRight size={17} />

        </button>

      </form>


      <div className="auth-footer">

        {mode === "signin" ? (
          <>
            Don't have an account?

            <button
              onClick={() =>
                setMode("signup")
              }
            >
              Create account
            </button>
          </>
        ) : (
          <>
            Already have an account?

            <button
              onClick={() =>
                setMode("signin")
              }
            >
              Sign in
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default AuthForm;