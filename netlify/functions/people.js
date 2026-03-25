import { neon } from "@netlify/neon";

const sql = neon();

export default async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS people (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        manager_id INTEGER NULL
      )
    `;

    const existing = await sql`SELECT COUNT(*)::int AS count FROM people`;

    if (existing[0].count === 0) {
      await sql`
        INSERT INTO people (name, role, manager_id)
        VALUES
          ('Paul Jackson', 'UX Manager', NULL),
          ('Sue Example', 'Lead Designer', 1),
          ('Alex Example', 'Researcher', 1)
      `;
    }

    const rows = await sql`
      SELECT id, name, role, manager_id
      FROM people
      ORDER BY id
    `;

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};