import SCHEMA from './schema';

// Type for database parameters (matches Turso HTTP API)
type DbParam = string | number | boolean | null;

// Turso HTTP API response types
interface TursoResponse {
  results: Array<{
    columns: string[];
    rows: Array<Array<string | number | boolean | null>>;
  }>;
}

// Convert Turso HTTP response to objects
function rowsToObjects<T>(columns: string[], rows: Array<Array<any>>): T[] {
  return rows.map(row => {
    const obj: any = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
}

// Execute SQL via Turso HTTP API
async function executeSql(sql: string, args: DbParam[] = []): Promise<TursoResponse> {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!tursoUrl || !tursoToken) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
  }

  // Convert libsql:// URL to https://
  const httpUrl = tursoUrl.replace('libsql://', 'https://');
  
  const response = await fetch(`${httpUrl}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tursoToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          type: 'execute',
          stmt: {
            sql,
            args: args.map(arg => ({ type: 'text', value: String(arg ?? '') })),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Turso HTTP API error: ${response.status} ${error}`);
  }

  return await response.json();
}

// Initialize database schema
export async function initSchema() {
  try {
    const statements = SCHEMA.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await executeSql(stmt);
      }
    }
  } catch (error) {
    console.error('Error initializing schema:', error);
  }
}

// Safe query execution
export async function query<T>(sql: string, params: DbParam[] = []): Promise<T[]> {
  const response = await executeSql(sql, params);
  const result = response.results[0];
  return rowsToObjects<T>(result.columns, result.rows);
}

// Safe single row query
export async function queryOne<T>(sql: string, params: DbParam[] = []): Promise<T | undefined> {
  const results = await query<T>(sql, params);
  return results[0];
}

// Safe insert/update/delete
export async function execute(sql: string, params: DbParam[] = []): Promise<{ rowsAffected: number; lastInsertRowid?: bigint }> {
  const response = await executeSql(sql, params);
  const result = response.results[0];
  
  // For INSERT statements, try to get the last insert ID
  // Note: Turso HTTP API doesn't directly return lastInsertRowid
  // We'll need to use RETURNING clause or a separate query
  return { 
    rowsAffected: result?.rows?.length || 0,
    lastInsertRowid: undefined // Will be handled by RETURNING clause
  };
}

// Transaction wrapper (simplified for HTTP API)
export async function transaction<T>(fn: () => Promise<T>): Promise<T> {
  // Note: Turso HTTP API doesn't support transactions in the same way
  // For now, just execute the function
  return await fn();
}

// No-op for HTTP API
export function closeDb(): void {
  // Nothing to close with HTTP API
}

// Deprecated - kept for compatibility
export function getDb(): any {
  return {
    execute: executeSql,
  };
}
