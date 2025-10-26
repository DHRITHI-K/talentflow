import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/CandidateProfile.css";

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidate();
    fetchTimeline();
  }, [id]);

  const fetchCandidate = async () => {
    const response = await fetch(`/api/candidates/${id}`);
    const data = await response.json();
    setCandidate(data.candidate);
    setLoading(false);
  };

  const fetchTimeline = async () => {
    const response = await fetch(`/api/candidates/${id}/timeline`);
    const data = await response.json();
    setTimeline(data.timeline);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        author: user.username,
        date: new Date().toISOString().split("T")[0]
      };
      setNotes([note, ...notes]);
      setNewNote("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div className="loading">Loading candidate...</div>;
  }

  if (!candidate) {
    return <div className="error">Candidate not found</div>;
  }

  return (
    <div className="candidate-profile-page">
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
          <Link to="/candidates" className="btn-secondary">
            ← Back to Candidates
          </Link>
        </div>

        <div className="profile-container">
          <div className="profile-main">
            <div className="profile-header">
              <div className="avatar">{candidate.name.charAt(0)}</div>
              <div className="profile-info">
                <h2>{candidate.name}</h2>
                <p className="email">{candidate.email}</p>
                <p className="phone">{candidate.phone}</p>
                <span className={`stage-badge ${candidate.stage}`}>
                  {candidate.stage}
                </span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Timeline</h3>
              <div className="timeline">
                {timeline.map((event, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">{event.date}</span>
                      <strong className={`stage-label ${event.status}`}>
                        {event.status}
                      </strong>
                      <p>{event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h3>Notes</h3>
              <div className="notes-input">
                <textarea
                  placeholder="Add a note (use @mention for team members)..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  rows="3"
                />
                <button onClick={handleAddNote} className="btn-primary">
                  Add Note
                </button>
              </div>
              <div className="notes-list">
                {notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <strong>{note.author}</strong>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <p>{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="sidebar-section">
              <h4>Application Details</h4>
              <p>
                <strong>Applied:</strong> {candidate.appliedDate}
              </p>
              <p>
                <strong>Job ID:</strong> {candidate.jobId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
