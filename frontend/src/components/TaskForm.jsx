import { useState } from "react";
import "./TaskForm.css";

export default function TaskForm({ task, users, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    user_id: task?.user_id || "",
    deadline: task?.deadline || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.user_id) {
      alert("Judul dan User harus diisi");
      return;
    }
    onSave(formData);
  };

  // Get today's date for minimum date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Judul Task *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masukkan judul task"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">Pilih User *</label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="deadline">Tanggal Deadline</label>
          <input
            id="deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={today}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Masukkan deskripsi task (opsional)"
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          💾 Simpan
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          ❌ Batal
        </button>
      </div>
    </form>
  );
}
