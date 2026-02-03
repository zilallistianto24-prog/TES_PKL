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
        deadline DATE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      ["superadmin@company.com"]
    );

    if (adminCheck.rows.length === 0) {
      // Insert default admin user
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Super Admin", "superadmin@company.com", "securepass123", "admin"]
      );
      console.log("✅ Admin user created: superadmin@company.com / securepass123");
    }

    // Insert sample users
    const userCheck = await pool.query("SELECT COUNT(*) FROM users WHERE role = $1", ["user"]);
    if (userCheck.rows[0].count === 0) {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Alice Johnson", "alice@company.com", "password456", "user"]
      );
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Bob Wilson", "bob@company.com", "password456", "user"]
      );
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Carol Davis", "carol@company.com", "password456", "user"]
      );
      console.log("✅ Sample users created");
    }

    // Insert sample tasks
    const taskCheck = await pool.query("SELECT COUNT(*) FROM tasks");
    if (taskCheck.rows[0].count === 0) {
      const users = await pool.query("SELECT id FROM users WHERE role = $1", ["user"]);
      if (users.rows.length > 0) {
        await pool.query(
          "INSERT INTO tasks (title, description, status, user_id, deadline) VALUES ($1, $2, $3, $4, $5)",
          ["Website Redesign", "Modernize company website with new branding", "in_progress", users.rows[0].id, "2026-02-15"]
        );
        await pool.query(
          "INSERT INTO tasks (title, description, status, user_id, deadline) VALUES ($1, $2, $3, $4, $5)",
          ["API Integration", "Integrate payment gateway with third-party service", "pending", users.rows[1].id, "2026-02-05"]
        );
        await pool.query(
          "INSERT INTO tasks (title, description, status, user_id, deadline) VALUES ($1, $2, $3, $4, $5)",
          ["Database Optimization", "Optimize queries and indexing for performance", "completed", users.rows[0].id, "2026-01-30"]
        );
        await pool.query(
          "INSERT INTO tasks (title, description, status, user_id, deadline) VALUES ($1, $2, $3, $4, $5)",
          ["Security Audit", "Conduct comprehensive security review", "pending", users.rows[2].id, "2026-02-10"]
        );
        console.log("✅ Sample tasks created");
      }
    }

    console.log("✅ Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    process.exit(1);
  }
};

initDB();
