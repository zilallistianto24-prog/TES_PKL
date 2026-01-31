import "./TaskList.css";

const STATUS_COLORS = {
  pending: "#ffc107",
  in_progress: "#17a2b8",
  completed: "#28a745",
  cancelled: "#dc3545",
};

const STATUS_LABELS = {
  pending: "⏳ Pending",
  in_progress: "⚙️ In Progress",
  completed: "✅ Completed",
  cancelled: "❌ Cancelled",
};

export default function TaskList({
  tasks,
  users,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 Tidak ada task. Buat task baru untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            <h3>{task.title}</h3>
            <span
              className="task-status"
              style={{ backgroundColor: STATUS_COLORS[task.status] }}
            >
              {STATUS_LABELS[task.status]}
            </span>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-info">
            <span className="task-user">👤 {task.user_name}</span>
            <span className="task-date">
              📅 {new Date(task.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>

          <div className="task-actions">
            <select
              className="status-select"
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">⚙️ In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>

            <button
              className="btn btn-edit"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✏️ Edit
            </button>

            <button
              className="btn btn-delete"
              onClick={() => onDelete(task.id)}
              title="Delete task"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
