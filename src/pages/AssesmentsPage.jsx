import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/AssessmentsPage.css";

export default function AssessmentsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="assessments-page">
      <header className="page-header">
        <h1>TalentFlow</h1>
        <nav>
          <Link to="/jobs">Jobs</Link>
          <Link to="/candidates">Candidates</Link>
          <Link to="/assessments">Assessments</Link>
        </nav>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <h2>Assessments</h2>
          <button className="btn-primary">Create Assessment</button>
        </div>

        <div className="assessments-grid">
          <div className="assessment-card">
            <h3>Technical Assessment</h3>
            <p>For Frontend Developer position</p>
            <div className="assessment-stats">
              <span>10 Questions</span>
              <span>45 min</span>
            </div>
            <div className="assessment-actions">
              <button className="btn-text">Edit</button>
              <button className="btn-text">Preview</button>
            </div>
          </div>

          <div className="assessment-card">
            <h3>System Design</h3>
            <p>For Senior Engineer position</p>
            <div className="assessment-stats">
              <span>5 Questions</span>
              <span>60 min</span>
            </div>
            <div className="assessment-actions">
              <button className="btn-text">Edit</button>
              <button className="btn-text">Preview</button>
            </div>
          </div>

          <div className="assessment-card">
            <h3>Behavioral Interview</h3>
            <p>For all positions</p>
            <div className="assessment-stats">
              <span>8 Questions</span>
              <span>30 min</span>
            </div>
            <div className="assessment-actions">
              <button className="btn-text">Edit</button>
              <button className="btn-text">Preview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
