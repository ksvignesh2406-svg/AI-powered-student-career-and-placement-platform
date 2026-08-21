import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function FacultyPage() {

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

        <div className="role-intro purple">

          <div className="large-role-icon">
            <BookOpen size={40} />
          </div>

          <span>
            FACULTY WORKSPACE
          </span>

          <h1>
            Manage your
            <br />
            classroom.
          </h1>

          <p>
            Manage classes, attendance,
            student performance and academic activities.
          </p>

        </div>


        <AuthForm role="Faculty" />

      </div>

    </div>
  );
}

export default FacultyPage;