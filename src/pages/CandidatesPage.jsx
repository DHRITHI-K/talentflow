import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const url = new URL("/api/candidates", window.location.origin);
    if (stage !== "all") url.searchParams.append("stage", stage);
    const response = await fetch(url);
    const data = await response.json();
    setCandidates(data.candidates);
    setLoading(false);
  };

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={{
        background: "#fff",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ margin: 0, color: "#2563eb" }}>TalentFlow</h1>
        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link to="/jobs" style={{ color: "#333", textDecoration: "none" }}>Jobs</Link>
          <Link to="/candidates" style={{ color: "#333", textDecoration: "none" }}>Candidates</Link>
          <Link to="/assessments" style={{ color: "#333", textDecoration: "none" }}>Assessments</Link>
        </nav>
        <div>
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} style={{ marginLeft: 16 }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "2rem auto", padding: "0 1rem" }}>
        <h2>Candidates ({filtered.length})</h2>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: 16 }}
        />

        <select
          value={stage}
          onChange={e => setStage(e.target.value)}
          style={{ marginBottom: "1rem", padding: "0.5rem", fontSize: 16 }}
        >
          <option value="all">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech Interview</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>

        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          filtered.length === 0 ? (
            <p>No candidates found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {filtered.map(c => (
                <li key={c.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <Link to={`/candidates/${c.id}`} style={{ fontWeight: "bold", color: "#2563eb", textDecoration: "none" }}>
                    {c.name}
                  </Link>
                  {" - "}
                  <span>{c.email}</span>
                  {" - "}
                  <em>{c.stage}</em>
                </li>
              ))}
            </ul>
          )
        )}
      </main>
    </div>
  );
}
