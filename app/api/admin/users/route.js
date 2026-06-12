import { auth } from '@/lib/auth';
import pg from 'pg';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 100');
    await pool.end();

    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}