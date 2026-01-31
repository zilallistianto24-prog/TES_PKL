import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { taskAPI, userAPI } from "../api/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import UserManagement from "../components/UserManagement";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, usersRes] = await Promise.all([
        taskAPI.getAll(),
        userAPI.getAll(),
      ]);

      setTasks(tasksRes.data.data);
      setUsers(usersRes.data.data);
      setError("");
    } catch (err) {
      setError("Gagal memuat data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Yakin ingin menghapus task ini?")) {
      try {
        await taskAPI.delete(taskId);
        setTasks(tasks.filter((t) => t.id !== taskId));
      } catch (err) {
        alert("Gagal menghapus task");
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const res = await taskAPI.update(editingTask.id, taskData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data.data : t)));
      } else {
        const res = await taskAPI.create(taskData);
        setTasks([res.data.data, ...tasks]);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan task");
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const res = await taskAPI.updateStatus(taskId, status);
      setTasks(tasks.map((t) => (t.id === taskId ? res.data.data : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengupdate status");
    }
  };

  const handleRefreshUsers = () => {
    loadData();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📋 Task Manager</h1>
          <div className="header-info">
            <span className="user-info">👤 {user?.name}</span>
            <button onClick={logout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            📝 Tasks
          </button>
          <button
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
        </nav>

        <main className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}

          {loading && <div className="loading">Loading...</div>}

          {activeTab === "tasks" && (
            <div className="tasks-section">
              <div className="section-header">
                <h2>Manajemen Tasks</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(!showTaskForm);
                  }}
                >
                  {showTaskForm ? "❌ Batal" : "➕ Buat Task"}
                </button>
              </div>

              {showTaskForm && (
                <TaskForm
                  task={editingTask}
                  users={users}
                  onSave={handleSaveTask}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                />
              )}

              <TaskList
                tasks={tasks}
                users={users}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleUpdateStatus}
              />
            </div>
          )}

          {activeTab === "users" && (
            <UserManagement users={users} onRefresh={handleRefreshUsers} />
          )}
        </main>
      </div>
    </div>
  );
}
