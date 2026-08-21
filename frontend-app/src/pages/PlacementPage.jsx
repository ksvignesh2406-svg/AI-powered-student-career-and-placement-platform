import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  ArrowLeft,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function PlacementPage() {

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

        <div className="role-intro pink">

          <div className="large-role-icon">
            <BriefcaseBusiness size={40} />
          </div>

          <span>
            PLACEMENT WORKSPACE
          </span>

          <h1>
            Connect students
            <br />
            with opportunities.
          </h1>

          <p>
            Manage companies, drives,
            eligible students, applications and placements.
          </p>

        </div>


        <AuthForm role="Placement" />

      </div>

    </div>
  );
}

export default PlacementPage;