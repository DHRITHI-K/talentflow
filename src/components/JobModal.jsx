import { useState, useEffect } from "react";
import "../styles/Modal.css";

export default function JobModal({ job, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    location: "",
    salary: "",
    description: "",
    status: "active",
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug must be lowercase letters, numbers, and hyphens only";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{job ? "Edit Job" : "Create New Job"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Slug * (URL-friendly identifier)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={errors.slug ? "error" : ""}
            />
            {errors.slug && <span className="error-text">{errors.slug}</span>}
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $80k - $120k"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter"
              />
              <button type="button" onClick={addTag} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {job ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
