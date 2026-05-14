# Database Core Module

## Responsibility
This module manages database connections and operations for PostgreSQL and MySQL. It uses connection pooling for efficiency and provides helper methods for data validation and cleanup during test execution.

## Configuration
The module reads connection details from environment variables:
- `DB_TYPE` ('postgres' or 'mysql')
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`

## Methods
- `connect()`: Initialize the connection pool.
- `executeQuery(query, params)`: Run a raw SQL query.
- `findOne(table, condition, params)`: Find a single record.
- `delete(table, condition, params)`: Delete records based on condition.
- `disconnect()`: Close the connection pool.

## Usage
```typescript
const db = new DatabaseManager(config);
await db.connect();
const user = await db.findOne('users', 'email = ?', ['test@example.com']);
await db.disconnect();
```
