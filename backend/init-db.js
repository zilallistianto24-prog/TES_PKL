const pool = require("./src/config/db");

const initDB = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@example.com"]
    );

    if (adminCheck.rows.length === 0) {
      // Insert default admin user
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Admin", "admin@example.com", "admin123", "admin"]
      );
      console.log("✅ Admin user created: admin@example.com / admin123");
    }

    // Insert sample users
    const userCheck = await pool.query("SELECT COUNT(*) FROM users WHERE role = $1", ["user"]);
    if (userCheck.rows[0].count === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["John Doe", "john@example.com", "password123", "user"]
      );
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Jane Smith", "jane@example.com", "password123", "user"]
      );
      console.log("✅ Sample users created");
    }

    console.log("✅ Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    process.exit(1);
  }
};

initDB();
