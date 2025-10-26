import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import JobModal from "../components/JobModal";
import "../styles/JobsPage.css";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/jobs?${params}`);
    const data = await response.json();
    setJobs(data.jobs);
    setTotal(data.total);
    setLoading(false);
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleArchiveToggle = async (job) => {
    const newStatus = job.status === "active" ? "archived" : "active";
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    fetchJobs();
  };

  const handleSaveJob = async (jobData) => {
    if (editingJob) {
      await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });
    } else {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jobData, order: jobs.length })
      });
    }
    setShowModal(false);
    fetchJobs();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalPages = Math.ceil(total / filters.pageSize);

  return (
    <div className="jobs-page">
      <header className="page-header">
        <h1>TalentFlow</h1>
        <nav>
          <Link to="/jobs">Jobs</Link>
          <Link to="/candidates">Candidates</Link>
          <Link to="/assessments">Assessments</Link>
        </nav>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <div className="content">
        <div className="toolbar">
          <h2>Jobs Board</h2>
          <button onClick={handleCreateJob} className="btn-primary">
            + Create Job
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="search-input"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id} className={`job-card ${job.status}`}>
                  <div className="job-header">
                    <h3>
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <span className={`status-badge ${job.status}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="job-location">{job.location}</p>
                  <p className="job-salary">{job.salary}</p>
                  <div className="job-tags">
                    {job.tags?.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="job-actions">
                    <button onClick={() => handleEditJob(job)} className="btn-text">
                      Edit
                    </button>
                    <button onClick={() => handleArchiveToggle(job)} className="btn-text">
                      {job.status === "active" ? "Archive" : "Unarchive"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="btn-secondary"
              >
                Previous
              </button>
              <span>
                Page {filters.page} of {totalPages} ({total} total)
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === totalPages}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <JobModal
          job={editingJob}
          onSave={handleSaveJob}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
