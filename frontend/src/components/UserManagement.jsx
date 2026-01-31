import { useState } from "react";
import { userAPI } from "../api/api";
import "./UserManagement.css";

export default function UserManagement({ users, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: "" });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "" });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Nama dan Email harus diisi");
      return;
    }

    if (!editingUser && !formData.password) {
      alert("Password harus diisi untuk user baru");
      return;
    }

    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, {
          name: formData.name,
          email: formData.email,
        });
        alert("User berhasil diupdate");
      } else {
        await userAPI.create(formData);
        alert("User berhasil ditambahkan");
      }
      handleCloseForm();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        await userAPI.delete(userId);
        alert("User berhasil dihapus");
        onRefresh();
      } catch (err) {
        alert(err.response?.data?.message || "Gagal menghapus user");
      }
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>Manajemen Users</h2>
        <button
          className="btn btn-primary"
          onClick={() => handleOpenForm()}
        >
          {showForm ? "❌ Batal" : "➕ Tambah User"}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={handleSaveUser}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nama *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Masukkan nama user"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Masukkan email user"
                required
              />
            </div>

            {!editingUser && (
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Masukkan password"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              💾 Simpan
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
              className="btn btn-secondary"
            >
              ❌ Batal
            </button>
          </div>
        </form>
      )}

      <div className="users-table-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>📭 Tidak ada user. Tambahkan user baru untuk memulai.</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-edit-sm"
                      onClick={() => handleOpenForm(user)}
                      title="Edit user"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-delete-sm"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
