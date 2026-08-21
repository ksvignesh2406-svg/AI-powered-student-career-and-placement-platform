import { useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function ParentPage() {

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

        <div className="role-intro green">

          <div className="large-role-icon">
            <Users size={40} />
          </div>

          <span>
            PARENT WORKSPACE
          </span>

          <h1>
            Stay connected
            <br />
            with your child.
          </h1>

          <p>
            Monitor attendance, academic progress,
            announcements and important campus updates.
          </p>

        </div>


        <AuthForm role="Parent" />

      </div>

    </div>
  );
}

export default ParentPage;