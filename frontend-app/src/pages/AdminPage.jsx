import { useNavigate } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function AdminPage() {

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

        <div className="role-intro orange">

          <div className="large-role-icon">
            <Building2 size={40} />
          </div>

          <span>
            ADMIN WORKSPACE
          </span>

          <h1>
            Manage the
            <br />
            campus.
          </h1>

          <p>
            Manage students, faculty,
            departments, reports and campus operations.
          </p>

        </div>


        <AuthForm role="Admin" />

      </div>

    </div>
  );
}

export default AdminPage;