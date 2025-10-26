import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import JobsPage from "./pages/JobsPage";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Inline Candidates Page Component
function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/candidates?pageSize=100")
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header
        style={{
          background: "#fff",
          padding: "1rem 2rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, color: "#2563eb" }}>TalentFlow</h1>
        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link to="/jobs" style={{ color: "#333", textDecoration: "none" }}>
            Jobs
          </Link>
          <Link
            to="/candidates"
            style={{ color: "#333", textDecoration: "none" }}
          >
            Candidates
          </Link>
          <Link
            to="/assessments"
            style={{ color: "#333", textDecoration: "none" }}
          >
            Assessments
          </Link>
        </nav>
        <div>
          <span>Welcome, {user?.username}!</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <h2>Candidates ({filteredCandidates.length})</h2>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />

        {loading ? (
          <div>Loading candidates...</div>
        ) : (
          <div
            style={{ background: "white", padding: "1rem", borderRadius: "8px" }}
          >
            {filteredCandidates.slice(0, 50).map((candidate) => (
              <div
                key={candidate.id}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #f0f0f0",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#2563eb" }}>
                    {candidate.name}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>
                    {candidate.email}
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    background: "#dbeafe",
                    color: "#1e40af",
                    textAlign: "center",
                    textTransform: "capitalize",
                  }}
                >
                  {candidate.stage}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#666" }}>
                  {candidate.phone}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#666" }}>
                  {candidate.appliedDate}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline Assessments Page Component
function AssessmentsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const assessments = [
    {
      id: 1,
      title: "Frontend Developer Assessment",
      description: "React, JavaScript, CSS knowledge test",
      questions: 12,
      duration: "45 min",
    },
    {
      id: 2,
      title: "Backend Engineer Assessment",
      description: "Node.js, databases, API design",
      questions: 10,
      duration: "60 min",
    },
    {
      id: 3,
      title: "System Design Assessment",
      description: "Architecture and scalability",
      questions: 5,
      duration: "90 min",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header
        style={{
          background: "#fff",
          padding: "1rem 2rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, color: "#2563eb" }}>TalentFlow</h1>
        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link to="/jobs" style={{ color: "#333", textDecoration: "none" }}>
            Jobs
          </Link>
          <Link
            to="/candidates"
            style={{ color: "#333", textDecoration: "none" }}
          >
            Candidates
          </Link>
          <Link
            to="/assessments"
            style={{ color: "#333", textDecoration: "none" }}
          >
            Assessments
          </Link>
        </nav>
        <div>
          <span>Welcome, {user?.username}!</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <h2>Assessments</h2>
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Create Assessment
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#1f2937" }}>
                {assessment.title}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {assessment.description}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  margin: "1rem 0",
                  padding: "0.75rem",
                  background: "#f9fafb",
                  borderRadius: "4px",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {assessment.questions} Questions
                </span>
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {assessment.duration}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <AssessmentsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
