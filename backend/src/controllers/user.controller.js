const pool = require("../config/db");

// =====================
// GET ALL USERS
// =====================
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id"
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: "Berhasil mengambil data user",
    });
  } catch (error) {
    console.error("ERROR GET USERS:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user",
    });
  }
};

// =====================
// GET SINGLE USER
// =====================
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Berhasil mengambil data user",
    });
  } catch (error) {
    console.error("ERROR GET USER:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user",
    });
  }
};

// =====================
// CREATE USER
// =====================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, dan password wajib diisi",
      });
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, password, role || "user"]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "User berhasil dibuat",
    });
  } catch (error) {
    console.error("ERROR CREATE USER:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat user",
    });
  }
};

// =====================
// UPDATE USER
// =====================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "name dan email wajib diisi",
      });
    }

    // Check if email already exists (for other users)
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan oleh user lain",
      });
    }

    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role",
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "User berhasil diupdate",
    });
  } catch (error) {
    console.error("ERROR UPDATE USER:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal update user",
    });
  }
};

// =====================
// DELETE USER
// =====================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error("ERROR DELETE USER:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal hapus user",
    });
  }
};
