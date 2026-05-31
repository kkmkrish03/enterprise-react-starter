import initSqlJs from 'sql.js';

let dbInstance: any = null;
let initPromise: Promise<any> | null = null;

const LOCAL_STORAGE_DB_KEY = 'mock_sqlite_db_base64';

export function query<T>(db: any, sql: string, params?: any[]): T[] {
  const res = db.exec(sql, params);
  if (res.length === 0) return [];
  const { columns, values } = res[0];
  return values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return obj as T;
  });
}

export function run(db: any, sql: string, params?: any[]): void {
  db.run(sql, params);
  persistDb(db);
}

function persistDb(db: any): void {
  const binaryArray = db.export();
  let binaryString = '';
  const len = binaryArray.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(binaryArray[i]);
  }
  const base64 = btoa(binaryString);
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, base64);
}

export async function getSqliteDb(): Promise<any> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });

    const storedBase64 = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
    if (storedBase64) {
      try {
        const binaryString = atob(storedBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        dbInstance = new SQL.Database(bytes);
        return dbInstance;
      } catch (e) {
        console.error("Failed to load stored SQLite DB, recreating...", e);
      }
    }

    // Recreate fresh database
    dbInstance = new SQL.Database();
    
    // Create tables
    dbInstance.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        roles TEXT,
        tenantId TEXT,
        status TEXT
      );
      
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name TEXT,
        status TEXT,
        domain TEXT,
        plan TEXT,
        primaryColor TEXT,
        logoUrl TEXT
      );
      
      CREATE TABLE IF NOT EXISTS configs (
        key TEXT PRIMARY KEY,
        value TEXT,
        description TEXT,
        isPublic INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS roles (
        id TEXT PRIMARY KEY,
        name TEXT,
        permissions TEXT,
        description TEXT
      );
    `);

    // Seed defaults
    dbInstance.run(`
      INSERT OR IGNORE INTO users (id, name, email, roles, tenantId, status) VALUES 
      ('1', 'Admin User', 'admin@example.com', '["admin"]', 'default', 'ACTIVE'),
      ('2', 'John Doe', 'john@example.com', '["user"]', 'default', 'ACTIVE'),
      ('3', 'Jane Smith', 'jane@example.com', '["user"]', 'default', 'INACTIVE'),
      ('4', 'Super Admin', 'superadmin@example.com', '["super_admin"]', 'default', 'ACTIVE');

      INSERT OR IGNORE INTO tenants (id, name, status, domain, plan, primaryColor, logoUrl) VALUES 
      ('default', 'Default Tenant', 'ACTIVE', 'localhost', 'ENTERPRISE', '#1976d2', ''),
      ('acme', 'Acme Corporation', 'ACTIVE', 'acme.localhost', 'PRO', '#7b1fa2', ''),
      ('globex', 'Globex Corp', 'INACTIVE', 'globex.localhost', 'STARTER', '#388e3c', '');

      INSERT OR IGNORE INTO configs (key, value, description, isPublic) VALUES 
      ('ENABLE_MFA', 'true', 'Enforces multi-factor authentication for all administrative accounts.', 1),
      ('MAINTENANCE_MODE', 'false', 'Displays a maintenance screen to users and restricts platform access.', 1),
      ('MAX_USERS_LIMIT', '100', 'The maximum allowed active users for the current organization plan.', 0);

      INSERT OR IGNORE INTO roles (id, name, permissions, description) VALUES 
      ('admin', 'Administrator', '["manage_users", "manage_tenants", "manage_config", "read:all", "write:all"]', 'Full access to all platform resources and administrative configurations.'),
      ('user', 'Standard User', '["read:all"]', 'General read-only access to users and dashboards.');
    `);

    persistDb(dbInstance);
    return dbInstance;
  })();

  return initPromise;
}
export default getSqliteDb;
