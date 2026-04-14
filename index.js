//  CREATE TABLE seats (
//      id SERIAL PRIMARY KEY,
//      name VARCHAR(255),
//      isbooked INT DEFAULT 0
//  );
// INSERT INTO seats (isbooked)
// SELECT 0 FROM generate_series(1, 20);
import dotenv from "dotenv";
import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { isLogged } from "./src/modules/auth/auth.middleware.js";
import authRoutes from "./src/modules/auth/auth.routes.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

// Equivalent to mongoose connection
// Pool is nothing but group of connections
// If you pick one connection out of the pool and release it
// the pooler will keep that connection open for sometime to other clients to reuse

// const pool = new pg.Pool({
//   host: "localhost",
//   port: 5432,
//   user: "postgres",
//   password: "postgres",
//   database: "sql_class_2_db",
//   max: 20,
//   connectionTimeoutMillis: 0,
//   idleTimeoutMillis: 0,
// });

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = new express();
app.use(cors());
app.use(express.json());
app.use("/api/auth/", authRoutes);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//get all seats
app.get("/seats", async (req, res) => {
  const result = await pool.query("select * from seats"); // equivalent to Seats.find() in mongoose
  res.send(result.rows);
});

//book a seat give the seatId and your name

app.put("/:id", isLogged, async (req, res) => {
  let conn;

  try {
    const id = req.params.id;

    // ✅ use name (not id)
    const name = req.user.name;

    conn = await pool.connect();
    await conn.query("BEGIN");

    const result = await conn.query(
      "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE",
      [id],
    );

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Seat already booked",
      });
    }

    await conn.query("UPDATE seats SET isbooked = 1, name = $2 WHERE id = $1", [
      id,
      name,
    ]);

    await conn.query("COMMIT");

    res.json({
      success: true,
      message: "Seat booked successfully",
    });
  } catch (ex) {
    console.log(ex);

    if (conn) await conn.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => console.log("Server starting on port: " + port));
