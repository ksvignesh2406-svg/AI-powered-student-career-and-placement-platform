import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { registerUser, signInUser } from "../utils/authStorage";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: User,
    title: "Student Hub",
    description:
      "Access safety tools, night walk timers, academics, services and your campus snapshot.",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    title: "Command Center",
    description:
      "Handle real-time triage, spatial awareness, patrol routing and incident response.",
  },
  {
    id: "admin",
    label: "Admin",
    icon: Building2,
    title: "Administration Center",
    description:
      "Manage users, system health, departments, staff accounts and campus-wide operations.",
  },
  {
    id: "faculty",
    label: "Faculty",
    icon: GraduationCap,
    title: "Faculty Portal",
    description:
      "Manage classes, attendance, academic workflows and student support signals.",
  },
  {
    id: "placement",
    label: "Placement",
    icon: Award,
    title: "Placement Cell",
    description:
      "Manage hiring drives, interview rounds, eligible candidate lists and corporate partnerships.",
  },
  {
    id: "parent",
    label: "Parent",
    icon: Users,
    title: "Parent Portal",
    description:
      "View academic progress, financial status and important campus updates.",
  },
];

function BrandMark({ compact = false }) {
  return (
    <div className={compact ? "campus-mobile-brand" : "campus-auth-brand"}>
      <div className="campus-brand-icon">
        <Sparkles size={24} strokeWidth={2.5} />
      </div>

      <span>Campus OS</span>
    </div>
  );
}

function ShowcasePanel({ role }) {
  const Icon = role.icon;

  return (
    <aside className="campus-auth-showcase">
      <div className="campus-orb campus-orb-one" />
      <div className="campus-orb campus-orb-two" />

      <div className="campus-showcase-content">
        <BrandMark />

        <div className="campus-role-copy" key={role.id}>
          <div className="campus-role-pill">
            <Icon size={16} />
            <span>{role.label} Access</span>
          </div>

          <h1>
            Welcome to the
            <span>{role.title}</span>
          </h1>

          <p>{role.description}</p>
        </div>
      </div>

      <div className="campus-showcase-footer">
        <FeatureLine text="Unified real-time ecosystem" />
        <FeatureLine text="AI-driven proactive safety" />
      </div>
    </aside>
  );
}

function FeatureLine({ text }) {
  return (
    <div className="campus-feature-line">
      <CheckCircle2 size={18} />
      <span>{text}</span>
    </div>
  );
}

function AuthToggle({ isLogin, onChange }) {
  return (
    <div className="campus-auth-toggle" aria-label="Authentication mode">
      <button
        type="button"
        className={isLogin ? "active" : ""}
        onClick={() => onChange(true)}
      >
        Sign In
      </button>

      <button
        type="button"
        className={!isLogin ? "active" : ""}
        onClick={() => onChange(false)}
      >
        Create Account
      </button>
    </div>
  );
}

function RoleSelector({ activeRole, onChange }) {
  return (
    <div className="campus-role-selector">
      <label>Select Role</label>

      <div className="campus-role-grid">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              className={isActive ? "active" : ""}
              onClick={() => onChange(role.id)}
              title={role.label}
            >
              <Icon size={20} />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="campus-field">
      <label htmlFor={name}>{label}</label>

      <div className="campus-input-wrap">
        <Icon size={18} />

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}

function AuthForm({
  activeRole,
  isLogin,
  isLoading,
  form,
  onChange,
  onSubmit,
  error,
}) {
  const emailLabel =
    activeRole === "student"
      ? "Student ID / Email"
      : "Institutional Email";

  const emailPlaceholder =
    activeRole === "student"
      ? "e.g. 26BCE1123"
      : "name@campus.edu";

  return (
    <form onSubmit={onSubmit} className="campus-auth-form">
      {!isLogin && ["admin", "security", "placement"].includes(activeRole) && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            color: "#c2410c",
            fontSize: "12px",
            lineHeight: "1.4",
          }}
        >
          ℹ️ <strong>Note:</strong> {activeRole.toUpperCase()} accounts are issued directly by
          Campus Administration. If you have an assigned account, please switch to <strong>Sign In</strong>.
        </div>
      )}

      {!isLogin && (
        <Field
          icon={User}
          label="Full Name"
          name="name"
          placeholder="e.g. Arjun Sharma"
          value={form.name}
          onChange={onChange}
        />
      )}

      {!isLogin && activeRole === "faculty" && (
        <Field
          icon={Briefcase}
          label="Department"
          name="department"
          placeholder="e.g. Computer Science"
          value={form.department}
          onChange={onChange}
        />
      )}

      {!isLogin && activeRole === "parent" && (
        <>
          <Field
            icon={GraduationCap}
            label="Child's name"
            name="childName"
            placeholder="e.g. Ananya Sharma"
            value={form.childName}
            onChange={onChange}
          />
          <Field
            icon={Users}
            label="Relationship"
            name="relationship"
            placeholder="e.g. Mother or Father"
            value={form.relationship}
            onChange={onChange}
          />
        </>
      )}

      <Field
        icon={Mail}
        label={emailLabel}
        name="email"
        placeholder={emailPlaceholder}
        value={form.email}
        onChange={onChange}
      />

      <Field
        icon={Lock}
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={onChange}
      />

      {isLogin && (
        <div className="campus-form-options">
          <label>
            <input type="checkbox" />
            Remember me
          </label>

          <button type="button">Forgot password?</button>
        </div>
      )}

      <button type="submit" disabled={isLoading} className="campus-submit">
        {isLoading ? (
          <>
            <span className="campus-spinner" />
            Processing...
          </>
        ) : (
          <>
            <span>{isLogin ? "Sign In" : "Create Account"}</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {error && <p className="campus-form-error">{error}</p>}
    </form>
  );
}

function CampusOSAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [activeRole, setActiveRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    childName: "",
    relationship: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const currentRole =
    roles.find((role) => role.id === activeRole) || roles[0];

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!isLogin && ["admin", "security", "placement"].includes(activeRole)) {
      setError(
        `${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} accounts cannot be registered publicly. Please contact Campus IT or Sign In.`
      );
      return;
    }

    setIsLoading(true);

    const result = isLogin
      ? await signInUser(activeRole, form.email.trim(), form.password)
      : await registerUser({
          role: activeRole,
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          department: form.department.trim(),
          childName: form.childName.trim(),
          relationship: form.relationship.trim(),
        });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(`/${activeRole}`);
  };

  return (
    <main className="campus-auth-page">
      <section className="campus-auth-shell mounted">
        <ShowcasePanel role={currentRole} />

        <div className="campus-auth-panel">
          <BrandMark compact />

          <div className="campus-auth-inner">
            <AuthToggle isLogin={isLogin} onChange={setIsLogin} />

            <div className="campus-auth-heading">
              <h2>{isLogin ? "Welcome back" : "Get started"}</h2>

              <p>
                {isLogin
                  ? "Enter your details to access your dashboard."
                  : "Select your role and create your campus account."}
              </p>
            </div>

            <RoleSelector
              activeRole={activeRole}
              onChange={setActiveRole}
            />

            <AuthForm
              activeRole={activeRole}
              isLogin={isLogin}
              isLoading={isLoading}
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              error={error}
            />

            <p className="campus-terms">
              By continuing, you agree to the Campus OS
              <a href="#"> Terms of Service</a> and
              <a href="#"> Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CampusOSAuth;
