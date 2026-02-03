const { Client } = require("pg");

const setupDB = async () => {
  const client = new Client({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    password: process.env.DB_PASSWORD || "postgres",
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log("🔗 Connected to PostgreSQL server");

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || "task_management"]
    );

    if (result.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE "${process.env.DB_NAME || "task_management"}"`);
      console.log(`✅ Database "${process.env.DB_NAME || "task_management"}" created successfully`);
    } else {
      console.log(`✅ Database "${process.env.DB_NAME || "task_management"}" already exists`);
    }

    await client.end();

    // Now run the initialization script
    console.log("\n🔄 Initializing database tables and data...\n");
    require("./init-db");
  } catch (error) {
    console.error("❌ Setup error:", error.message);
    process.exit(1);
  }
};

setupDB();
