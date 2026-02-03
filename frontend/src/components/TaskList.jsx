import "./TaskList.css";

const STATUS_COLORS = {
  pending: "#ffc107",
  in_progress: "#0891b2",
  completed: "#10b981",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  pending: "⏳ Pending",
  in_progress: "⚙️ In Progress",
  completed: "✅ Completed",
  cancelled: "❌ Cancelled",
};

// Helper function untuk cek status deadline
const getDeadlineStatus = (deadline) => {
  if (!deadline) return { status: "no-deadline", icon: "", text: "" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "overdue", icon: "🚨", text: `${Math.abs(diffDays)} hari terlewat`, color: "#ef4444" };
  } else if (diffDays === 0) {
    return { status: "today", icon: "⚠️", text: "Hari ini!", color: "#f59e0b" };
  } else if (diffDays <= 3) {
    return { status: "urgent", icon: "⚡", text: `${diffDays} hari lagi`, color: "#f59e0b" };
  } else if (diffDays <= 7) {
    return { status: "soon", icon: "📌", text: `${diffDays} hari lagi`, color: "#0891b2" };
  } else {
    return { status: "ok", icon: "📅", text: deadlineDate.toLocaleDateString("id-ID"), color: "#64748b" };
  }
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
      {tasks.map((task) => {
        const deadlineInfo = getDeadlineStatus(task.deadline);
        const isDeadlineCritical = ["overdue", "today", "urgent"].includes(
          deadlineInfo.status
        );

        return (
          <div
            key={task.id}
            className={`task-card ${isDeadlineCritical ? "deadline-warning" : ""}`}
          >
            {isDeadlineCritical && (
              <div className="deadline-alert">
                <span className="alert-icon">{deadlineInfo.icon}</span>
                <span className="alert-text">{deadlineInfo.text}</span>
              </div>
            )}

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
              {task.deadline && (
                <span
                  className={`task-deadline deadline-${deadlineInfo.status}`}
                  style={{ color: deadlineInfo.color }}
                >
                  {deadlineInfo.icon} {deadlineInfo.text}
                </span>
              )}
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
        );
      })}
    </div>
  );
}
