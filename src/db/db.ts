import { drizzle } from 'drizzle-orm/neon-http';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

function createDbClient() {
    if (!connectionString) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('[DB] Warning: DATABASE_URL environment variable is not set.');
        }
        return null;
    }

    // neon(connectionString) uses stateless HTTP connection pooling
    const sql = neon(connectionString);
    return drizzle(sql, { schema });
}

export const db = createDbClient();

