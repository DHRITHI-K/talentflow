import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../auth/AuthContext";
import "../styles/KanbanBoard.css";

const STAGES = [
  { id: "applied", label: "Applied", color: "#3b82f6" },
  { id: "screen", label: "Screen", color: "#8b5cf6" },
  { id: "tech", label: "Tech Interview", color: "#f59e0b" },
  { id: "offer", label: "Offer", color: "#10b981" },
  { id: "hired", label: "Hired", color: "#06b6d4" },
  { id: "rejected", label: "Rejected", color: "#ef4444" }
];

export default function KanbanBoard() {
  const [candidatesByStage, setCandidatesByStage] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    const response = await fetch("/api/candidates?pageSize=1000");
    const data = await response.json();

    const grouped = STAGES.reduce((acc, stage) => {
      acc[stage.id] = data.candidates.filter(c => c.stage === stage.id);
      return acc;
    }, {});

    setCandidatesByStage(grouped);
    setLoading(false);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    const newCandidatesByStage = { ...candidatesByStage };
    const sourceList = [...newCandidatesByStage[sourceStage]];
    const destList =
      sourceStage === destStage
        ? sourceList
        : [...newCandidatesByStage[destStage]];

    const [movedCandidate] = sourceList.splice(source.index, 1);
    movedCandidate.stage = destStage;
    destList.splice(destination.index, 0, movedCandidate);

    newCandidatesByStage[sourceStage] = sourceList;
    if (sourceStage !== destStage) {
      newCandidatesByStage[destStage] = destList;
    }

    setCandidatesByStage(newCandidatesByStage);

    try {
      await fetch(`/api/candidates/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destStage })
      });
    } catch (error) {
      console.error("Failed to update candidate stage:", error);
      fetchCandidates();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div className="loading">Loading kanban board...</div>;
  }

  return (
    <div className="kanban-page">
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
          <h2>Kanban Board</h2>
          <Link to="/candidates" className="btn-secondary">
            Back to List
          </Link>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {STAGES.map(stage => (
              <div key={stage.id} className="kanban-column">
                <div
                  className="column-header"
                  style={{ backgroundColor: stage.color }}
                >
                  <h3>{stage.label}</h3>
                  <span className="count">
                    {candidatesByStage[stage.id]?.length || 0}
                  </span>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`column-content ${
                        snapshot.isDraggingOver ? "dragging-over" : ""
                      }`}
                    >
                      {candidatesByStage[stage.id]?.map((candidate, index) => (
                        <Draggable
                          key={candidate.id}
                          draggableId={String(candidate.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`candidate-card ${
                                snapshot.isDragging ? "dragging" : ""
                              }`}
                            >
                              <Link
                                to={`/candidates/${candidate.id}`}
                                className="candidate-link"
                              >
                                <strong>{candidate.name}</strong>
                              </Link>
                              <p className="candidate-email">
                                {candidate.email}
                              </p>
                              <p className="candidate-date">
                                Applied: {candidate.appliedDate}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
