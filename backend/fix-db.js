const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "task_management",
  password: "postgres",
  port: 5432,
});

const fixDB = async () => {
  try {
    // Check if updated_at column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='updated_at'
    `);

    if (checkColumn.rows.length === 0) {
      // Add updated_at column if it doesn't exist
      await pool.query(`
        ALTER TABLE tasks 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log("✅ Column updated_at added to tasks table");
    } else {
      console.log("✅ Column updated_at already exists");
    }

    console.log("✅ Database fixed successfully");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database fix error:", error.message);
    await pool.end();
    process.exit(1);
  }
};

fixDB();
