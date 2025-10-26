import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "++id, title, slug, status, tags, order",
  candidates: "++id, name, email, stage, jobId",
  assessments: "++id, jobId, questions",
  responses: "++id, candidateId, assessmentId, answers"
});
