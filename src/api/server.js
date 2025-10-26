import { createServer, Model, Factory, Response } from "miragejs";

export function makeServer() {
  return createServer({
    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
    },

    factories: {
      job: Factory.extend({
        title(i) {
          const titles = [
            "Senior Frontend Developer",
            "Backend Engineer",
            "Full Stack Developer",
            "UI/UX Designer",
            "Data Scientist",
            "DevOps Engineer",
            "Product Manager",
            "QA Engineer",
            "Mobile Developer",
            "Machine Learning Engineer"
          ];
          return titles[i % titles.length];
        },
        slug(i) {
          return `job-${i + 1}`;
        },
        status() {
          return Math.random() > 0.3 ? "active" : "archived";
        },
        tags() {
          const allTags = ["remote", "full-time", "frontend", "backend", "senior", "junior", "hybrid"];
          const count = Math.floor(Math.random() * 3) + 1;
          return Array.from({ length: count }, () =>
            allTags[Math.floor(Math.random() * allTags.length)]
          );
        },
        order(i) {
          return i;
        },
        description() {
          return "We are looking for talented professionals to join our India team.";
        },
        location() {
          const locations = [
            "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune",
            "Chennai", "Kolkata", "Gurgaon", "Noida", "Ahmedabad"
          ];
          return locations[Math.floor(Math.random() * locations.length)];
        },
        salary() {
          const start = Math.floor(Math.random() * 10) + 6;
          const end = start + Math.floor(Math.random() * 10) + 4;
          return `₹${start}L - ₹${end}L`;
        }
      }),

      candidate: Factory.extend({
        name(i) {
          const firstNames = [
            "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun",
            "Reyansh", "Sai", "Arnav", "Ishaan", "Kabir"
          ];
          const lastNames = [
            "Sharma", "Verma", "Singh", "Roy", "Nair",
            "Kumar", "Das", "Jain", "Agarwal", "Bhat"
          ];
          return `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / 10) % lastNames.length]}`;
        },
        email(i) {
          return `candidate${i}@example.com`;
        },
        stage() {
          const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
          return stages[Math.floor(Math.random() * stages.length)];
        },
        jobId() {
          return Math.floor(Math.random() * 25) + 1;
        },
        phone() {
          return `+91-${Math.floor(Math.random() * 9000000000) + 900000000}`;
        },
        appliedDate() {
          const days = Math.floor(Math.random() * 30);
          const date = new Date();
          date.setDate(date.getDate() - days);
          return date.toISOString().split('T')[0];
        }
      }),

      assessment: Factory.extend({
        jobId(i) {
          return (i % 3) + 1; // First 3 jobs have assessments
        },
        title() {
          return "Technical Assessment";
        },
        questions() {
          return [
            {
              id: 1,
              type: "single-choice",
              question: "What is your experience level with React?",
              options: ["Beginner", "Intermediate", "Advanced", "Expert"],
              required: true
            },
            {
              id: 2,
              type: "multi-choice",
              question: "Which of these Indian tech stacks have you worked with?",
              options: ["JavaScript", "TypeScript", "Python", "Java", "Go"],
              required: true
            },
            {
              id: 3,
              type: "short-text",
              question: "What is your current location (city in India)?",
              maxLength: 100,
              required: true
            },
            {
              id: 4,
              type: "long-text",
              question: "Describe your most challenging project.",
              maxLength: 500,
              required: false
            },
            {
              id: 5,
              type: "numeric",
              question: "Years of professional experience?",
              min: 0,
              max: 50,
              required: true
            }
          ];
        }
      })
    },

    seeds(server) {
      server.createList("job", 25);
      server.createList("candidate", 1000);
      server.createList("assessment", 3);
    },

    routes() {
      this.namespace = "api";
      this.timing = 500; // Simulate network delay

      // Jobs routes
      this.get("/jobs", (schema, request) => {
        let jobs = schema.jobs.all().models;

        // Filter by status
        const status = request.queryParams.status;
        if (status && status !== "all") {
          jobs = jobs.filter(job => job.status === status);
        }

        // Search by title
        const search = request.queryParams.search;
        if (search) {
          jobs = jobs.filter(job =>
            job.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Pagination
        const page = parseInt(request.queryParams.page) || 1;
        const pageSize = parseInt(request.queryParams.pageSize) || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        const paginatedJobs = jobs.slice(start, end);

        return {
          jobs: paginatedJobs,
          total: jobs.length,
          page,
          pageSize
        };
      });

      this.get("/jobs/:id", (schema, request) => {
        return schema.jobs.find(request.params.id);
      });

      this.post("/jobs", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.jobs.create(attrs);
      });

      this.patch("/jobs/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.find(id);
        return job.update(attrs);
      });

      this.patch("/jobs/:id/reorder", (schema, request) => {
        // Simulate 10% error rate for testing rollback
        if (Math.random() < 0.1) {
          return new Response(500, {}, { error: "Reorder failed" });
        }
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.find(id);
        return job.update(attrs);
      });

      // Candidates routes
      this.get("/candidates", (schema, request) => {
        let candidates = schema.candidates.all().models;

        // Search
        const search = request.queryParams.search;
        if (search) {
          candidates = candidates.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Filter by stage
        const stage = request.queryParams.stage;
        if (stage && stage !== "all") {
          candidates = candidates.filter(c => c.stage === stage);
        }

        // Pagination
        const page = parseInt(request.queryParams.page) || 1;
        const pageSize = parseInt(request.queryParams.pageSize) || 50;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        return {
          candidates: candidates.slice(start, end),
          total: candidates.length,
          page,
          pageSize
        };
      });

      this.get("/candidates/:id", (schema, request) => {
        return schema.candidates.find(request.params.id);
      });

      this.patch("/candidates/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const candidate = schema.candidates.find(id);
        return candidate.update(attrs);
      });

      this.get("/candidates/:id/timeline", (schema, request) => {
        return {
          timeline: [
            { date: "2025-10-01", status: "applied", note: "Application submitted" },
            { date: "2025-10-05", status: "screen", note: "Phone screening completed" },
            { date: "2025-10-10", status: "tech", note: "Technical interview scheduled" },
          ]
        };
      });

      // Assessments routes
      this.get("/assessments", (schema) => {
        return schema.assessments.all();
      });

      this.get("/assessments/:jobId", (schema, request) => {
        const assessments = schema.assessments.where({ jobId: request.params.jobId }).models;
        return assessments.length > 0 ? assessments[0] : null;
      });

      this.put("/assessments/:jobId", (schema, request) => {
        const jobId = request.params.jobId;
        const attrs = JSON.parse(request.requestBody);

        const existing = schema.assessments.where({ jobId }).models[0];
        if (existing) {
          return existing.update(attrs);
        }
        return schema.assessments.create({ ...attrs, jobId });
      });

      this.post("/assessments/:jobId/submit", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return { success: true, data: attrs };
      });
    }
  });
}
