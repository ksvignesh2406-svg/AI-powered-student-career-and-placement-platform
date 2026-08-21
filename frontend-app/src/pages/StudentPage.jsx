import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import AuthForm from "../components/AuthForm";

function StudentPage() {

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

        <div className="role-intro blue">

          <div className="large-role-icon">
            <GraduationCap size={40} />
          </div>

          <span>
            STUDENT WORKSPACE
          </span>

          <h1>
            Your campus,
            <br />
            at your fingertips.
          </h1>

          <p>
            Access academics, attendance,
            assignments, timetable, placements
            and campus services.
          </p>

          <div className="role-benefit">
            <ShieldCheck size={17} />
            Secure student access
          </div>

        </div>


        <AuthForm role="Student" />

      </div>

    </div>
  );
}

export default StudentPage;