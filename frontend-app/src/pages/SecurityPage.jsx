import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function SecurityPage() {

  const navigate = useNavigate();

  return (
    <div className="role-page">

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={17} />
        Back to UniCore
      </button>

      <div className="role-page-content">

        <div className="role-intro red">

          <div className="large-role-icon">
            <ShieldCheck size={40} />
          </div>

          <span>
            SECURITY WORKSPACE
          </span>

          <h1>
            Keep the campus
            <br />
            safe.
          </h1>

          <p>
            Manage campus security,
            incidents, visitor access and emergency alerts.
          </p>

        </div>


        <AuthForm role="Security" />

      </div>

    </div>
  );
}

export default SecurityPage;