import { Pool as PGPool } from 'pg';
import mysql from 'mysql2/promise';
import logger from '@utils/Logger';

export interface DBConfig {
  type: 'postgres' | 'mysql';
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export class DatabaseManager {
  private pgPool?: PGPool;
  private mysqlPool?: mysql.Pool;
  private config: DBConfig;

  constructor(config: DBConfig) {
    this.config = config;
  }

  async connect() {
    if (this.config.type === 'postgres') {
      logger.info(`Connecting to PostgreSQL at ${this.config.host}`);
      this.pgPool = new PGPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        max: 10, // Max clients in pool
      });
    } else {
      logger.info(`Connecting to MySQL at ${this.config.host}`);
      this.mysqlPool = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: 10,
      });
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    logger.info(`Executing DB Query: ${query} with params: ${JSON.stringify(params)}`);
    try {
      if (this.config.type === 'postgres') {
        const client = await this.pgPool!.connect();
        try {
          const res = await client.query(query, params);
          return res.rows;
        } finally {
          client.release();
        }
      } else {
        const [rows] = await this.mysqlPool!.execute(query, params);
        return rows;
      }
    } catch (error) {
      logger.error(`Database Query Error: ${error}`);
      throw error;
    }
  }

  async disconnect() {
    logger.info('Disconnecting from Database');
    if (this.pgPool) await this.pgPool.end();
    if (this.mysqlPool) await this.mysqlPool.end();
  }

  // CRUD Helpers
  async findOne(table: string, condition: string, params: any[]) {
    const query = `SELECT * FROM ${table} WHERE ${condition} LIMIT 1`;
    const results = await this.executeQuery(query, params);
    return results.length > 0 ? results[0] : null;
  }

  async delete(table: string, condition: string, params: any[]) {
    const query = `DELETE FROM ${table} WHERE ${condition}`;
    return await this.executeQuery(query, params);
  }
}
