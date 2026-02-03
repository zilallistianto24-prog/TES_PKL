const pool = require("../config/db");

// =====================
// GET ALL TASKS
// =====================
exports.getTasks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.deadline,
        tasks.created_at,
        users.id as user_id,
        users.name AS user_name,
        users.email as user_email
      FROM tasks
      JOIN users ON tasks.user_id = users.id
      ORDER BY tasks.deadline ASC, tasks.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: "Berhasil mengambil data task",
    });
  } catch (error) {
    console.error("ERROR GET TASKS:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data task",
    });
  }
};

// =====================
// GET TASK BY ID
// =====================
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.deadline,
        tasks.created_at,
        users.id as user_id,
        users.name AS user_name,
        users.email as user_email
      FROM tasks
      JOIN users ON tasks.user_id = users.id
      WHERE tasks.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Berhasil mengambil data task",
    });
  } catch (error) {
    console.error("ERROR GET TASK:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data task",
    });
  }
};

// =====================
// CREATE TASK
// =====================
exports.createTask = async (req, res) => {
  try {
    const { title, description, user_id, deadline } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({
        success: false,
        message: "title dan user_id wajib diisi",
      });
    }

    // Verify user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, user_id, deadline, status) 
       VALUES ($1, $2, $3, $4, 'pending') 
       RETURNING id, title, description, status, deadline, user_id`,
      [title, description || null, user_id, deadline || null]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Task berhasil dibuat",
    });
  } catch (error) {
    console.error("ERROR CREATE TASK:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat task",
    });
  }
};

// =====================
// UPDATE DETAIL TASK
// =====================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, user_id, deadline } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title wajib diisi",
      });
    }

    if (user_id) {
      const userCheck = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [user_id]
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }
    }

    const result = await pool.query(
      `UPDATE tasks 
       SET title=$1, description=$2, user_id=COALESCE($3, user_id), deadline=$4, updated_at=CURRENT_TIMESTAMP
       WHERE id=$5 
       RETURNING id, title, description, status, deadline, user_id, updated_at`,
      [title, description || null, user_id || null, deadline || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Detail task berhasil diupdate",
    });
  } catch (error) {
    console.error("ERROR UPDATE TASK:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal update task",
    });
  }
};

// =====================
// UPDATE STATUS TASK
// =====================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status wajib diisi",
      });
    }

    const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
      });
    }

    const result = await pool.query(
      `UPDATE tasks 
       SET status=$1, updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING id, title, status, updated_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Status task berhasil diupdate",
    });
  } catch (error) {
    console.error("ERROR UPDATE STATUS:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal update status task",
    });
  }
};

// =====================
// DELETE TASK
// =====================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task berhasil dihapus",
    });
  } catch (error) {
    console.error("ERROR DELETE TASK:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal hapus task",
    });
  }
};
