import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

// Text field with label + error message wired up for screen readers
function Field({ id, label, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {children}
      {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

function PasswordInput({ id, name, value, onChange, error, autoComplete, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-group">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        className={`form-control ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <button
        type="button"
        className="btn btn-outline-secondary input-group-btn"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}

function Auth() {
  const { user, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState(EMPTY_LOGIN);
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  // Already logged in → nothing to do here
  if (user) return <Navigate to={redirectTo} replace />;

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email.trim()) errors.email = "Enter your email address.";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = "Enter a valid email address.";
    if (!loginData.password) errors.password = "Enter your password.";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const d = registerData;
    const errors = {};
    if (!d.name.trim()) errors.name = "Enter your full name.";
    if (!d.email.trim()) errors.email = "Enter your email address.";
    else if (!/\S+@\S+\.\S+/.test(d.email)) errors.email = "Enter a valid email address.";
    if (!/^[0-9]{10}$/.test(d.phone.trim())) errors.phone = "Enter a 10-digit phone number.";
    if (d.password.length < 6) errors.password = "Use at least 6 characters.";
    if (!d.confirmPassword) errors.confirmPassword = "Re-enter your password.";
    else if (d.password !== d.confirmPassword) errors.confirmPassword = "Passwords don't match.";
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const result = login(loginData.email, loginData.password);
    if (!result.ok) {
      setLoginErrors({ [result.field]: result.error });
      return;
    }
    toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
    navigate(redirectTo, { replace: true });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const result = register(registerData);
    if (!result.ok) {
      setRegisterErrors({ [result.field]: result.error });
      return;
    }
    toast.success("Account created. Log in to continue.");
    setLoginData({ email: registerData.email, password: "" });
    setRegisterData(EMPTY_REGISTER);
    setIsLogin(true);
  };

  const switchTo = (login) => {
    setIsLogin(login);
    setLoginErrors({});
    setRegisterErrors({});
  };

  const inputProps = (id, errors) => ({
    className: `form-control ${errors[id] ? "is-invalid" : ""}`,
    "aria-invalid": !!errors[id],
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

  return (
    <div className="container py-5">
      <div className="auth-card">
        <div className="text-center mb-4">
          <img src={logo} alt="" width="72" height="57" className="rounded-circle" />
          <h1 className="h3 mt-2 mb-1">{isLogin ? "Log in" : "Create an account"}</h1>
          <p className="text-body-secondary mb-0">
            {location.state?.from === "/cart"
              ? "Log in to finish your order. Your cart is saved."
              : isLogin
                ? "Log in to check out faster and see your orders."
                : "It takes less than a minute."}
          </p>
        </div>

        <div className="segmented segmented--full mb-4" role="tablist" aria-label="Log in or register">
          <button type="button" role="tab" aria-selected={isLogin}
            className={`segmented__option ${isLogin ? "is-active" : ""}`} onClick={() => switchTo(true)}>
            Log in
          </button>
          <button type="button" role="tab" aria-selected={!isLogin}
            className={`segmented__option ${!isLogin ? "is-active" : ""}`} onClick={() => switchTo(false)}>
            Register
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} noValidate>
            <Field id="email" label="Email address" error={loginErrors.email}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                value={loginData.email} onChange={handleLoginChange} {...inputProps("email", loginErrors)} />
            </Field>
            <Field id="password" label="Password" error={loginErrors.password}>
              <PasswordInput id="password" name="password" value={loginData.password} onChange={handleLoginChange}
                error={loginErrors.password} autoComplete="current-password" />
            </Field>
            <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">Log in</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} noValidate>
            <Field id="name" label="Full name" error={registerErrors.name}>
              <input id="name" name="name" autoComplete="name"
                value={registerData.name} onChange={handleRegisterChange} {...inputProps("name", registerErrors)} />
            </Field>
            <Field id="email" label="Email address" error={registerErrors.email}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                value={registerData.email} onChange={handleRegisterChange} {...inputProps("email", registerErrors)} />
            </Field>
            <Field id="phone" label="Phone number" error={registerErrors.phone}>
              <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel"
                placeholder="10-digit mobile number"
                value={registerData.phone} onChange={handleRegisterChange} {...inputProps("phone", registerErrors)} />
            </Field>
            <Field id="new-password" label="Password" error={registerErrors.password}>
              <PasswordInput id="new-password" name="password" value={registerData.password}
                onChange={handleRegisterChange} error={registerErrors.password}
                autoComplete="new-password" placeholder="At least 6 characters" />
            </Field>
            <Field id="confirm-password" label="Confirm password" error={registerErrors.confirmPassword}>
              <PasswordInput id="confirm-password" name="confirmPassword" value={registerData.confirmPassword}
                onChange={handleRegisterChange} error={registerErrors.confirmPassword} autoComplete="new-password" />
            </Field>
            <button type="submit" className="btn btn-primary btn-lg w-100 mt-2">Create account</button>
          </form>
        )}

        <p className="auth-card__note">
          <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
          Demo app: accounts are saved in this browser only.
        </p>
      </div>
    </div>
  );
}

export default Auth;
