import { Sparkles } from "lucide-react";

function FacultyHeader({ professorName, department }) {
  return (
    <header className="faculty-v2-header">
      <div className="faculty-v2-brand">
        <div className="faculty-v2-brand-icon">
          <Sparkles size={19} />
        </div>
        <span>Campus OS</span>
      </div>

      <div className="faculty-v2-profile">
        <div>
          <strong>{professorName}</strong>
          <span>{department}</span>
        </div>
        <div className="faculty-v2-avatar">
          {professorName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default FacultyHeader;