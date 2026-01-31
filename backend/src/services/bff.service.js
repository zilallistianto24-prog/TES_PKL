// BFF API Service - Handles all business logic and data aggregation
const pool = require("../config/db");

// =====================
// AUTH SERVICE
// =====================
exports.authenticateUser = async (email, password) => {
  const result = await pool.query(
    "SELECT id, name, email, password, role FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw { status: 401, message: "Email atau password salah" };
  }

  const user = result.rows[0];

  if (user.password !== password) {
    throw { status: 401, message: "Email atau password salah" };
  }

  return user;
};

// =====================
// USER SERVICE
// =====================
exports.getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id"
  );
  return result.rows;
};

exports.getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  return result.rows[0];
};

exports.createNewUser = async (name, email, password, role = "user") => {
  const emailCheck = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (emailCheck.rows.length > 0) {
    throw { status: 400, message: "Email sudah terdaftar" };
  }

  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, email, password, role]
  );

  return result.rows[0];
};

exports.updateUserData = async (id, name, email) => {
  const emailCheck = await pool.query(
    "SELECT id FROM users WHERE email = $1 AND id != $2",
    [email, id]
  );

  if (emailCheck.rows.length > 0) {
    throw { status: 400, message: "Email sudah digunakan oleh user lain" };
  }

  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role",
    [name, email, id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  return result.rows[0];
};

exports.removeUser = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 RETURNING id",
    [id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  return result.rows[0];
};

// =====================
// TASK SERVICE
// =====================
exports.getAllTasks = async () => {
  const result = await pool.query(`
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.created_at,
      tasks.updated_at,
      users.id as user_id,
      users.name AS user_name,
      users.email as user_email
    FROM tasks
    JOIN users ON tasks.user_id = users.id
    ORDER BY tasks.created_at DESC
  `);

  return result.rows;
};

exports.getTaskById = async (id) => {
  const result = await pool.query(`
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.status,
      tasks.created_at,
      tasks.updated_at,
      users.id as user_id,
      users.name AS user_name,
      users.email as user_email
    FROM tasks
    JOIN users ON tasks.user_id = users.id
    WHERE tasks.id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw { status: 404, message: "Task tidak ditemukan" };
  }

  return result.rows[0];
};

exports.createNewTask = async (title, description, user_id) => {
  const userCheck = await pool.query(
    "SELECT id FROM users WHERE id = $1",
    [user_id]
  );

  if (userCheck.rows.length === 0) {
    throw { status: 404, message: "User tidak ditemukan" };
  }

  const result = await pool.query(
    `INSERT INTO tasks (title, description, user_id, status) 
     VALUES ($1, $2, $3, 'pending') 
     RETURNING id, title, description, status, user_id`,
    [title, description || null, user_id]
  );

  return result.rows[0];
};

exports.updateTaskDetails = async (id, title, description, user_id) => {
  if (user_id) {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      throw { status: 404, message: "User tidak ditemukan" };
    }
  }

  const result = await pool.query(
    `UPDATE tasks 
     SET title=$1, description=$2, user_id=COALESCE($3, user_id), updated_at=CURRENT_TIMESTAMP
     WHERE id=$4 
     RETURNING id, title, description, status, user_id, updated_at`,
    [title, description || null, user_id || null, id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "Task tidak ditemukan" };
  }

  return result.rows[0];
};

exports.updateTaskStatus = async (id, status) => {
  const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw {
      status: 400,
      message: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
    };
  }

  const result = await pool.query(
    `UPDATE tasks 
     SET status=$1, updated_at=CURRENT_TIMESTAMP
     WHERE id=$2
     RETURNING id, title, status, updated_at`,
    [status, id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "Task tidak ditemukan" };
  }

  return result.rows[0];
};

exports.removeTask = async (id) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id=$1 RETURNING id",
    [id]
  );

  if (result.rows.length === 0) {
    throw { status: 404, message: "Task tidak ditemukan" };
  }

  return result.rows[0];
};

// =====================
// AGGREGATE SERVICE (BFF Pattern)
// =====================
exports.getDashboardData = async () => {
  const [tasksResult, usersResult] = await Promise.all([
    pool.query("SELECT COUNT(*) as count FROM tasks"),
    pool.query("SELECT COUNT(*) as count FROM users"),
  ]);

  const tasks = await pool.query(`
    SELECT status, COUNT(*) as count FROM tasks GROUP BY status
  `);

  return {
    totalTasks: parseInt(tasksResult.rows[0].count),
    totalUsers: parseInt(usersResult.rows[0].count),
    tasksByStatus: tasks.rows,
  };
};
