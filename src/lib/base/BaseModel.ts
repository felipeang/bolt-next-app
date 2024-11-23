import { z } from 'zod';
import { pool } from '../db';

export class BaseModel {
  protected static tableName: string;
  protected static schema: z.ZodObject<any>;
  
  static async findAll() {
    const { rows } = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows.map(row => this.schema.parse(row));
  }

  static async findById(id: string) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows[0] ? this.schema.parse(rows[0]) : null;
  }

  static async create(data: any) {
    const validated = this.schema.parse(data);
    const keys = Object.keys(validated);
    const values = Object.values(validated);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const { rows } = await pool.query(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    );
    
    return this.schema.parse(rows[0]);
  }

  static async update(id: string, data: any) {
    const validated = this.schema.parse(data);
    const sets = Object.keys(validated)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    
    const { rows } = await pool.query(
      `UPDATE ${this.tableName} 
       SET ${sets} 
       WHERE id = $1 
       RETURNING *`,
      [id, ...Object.values(validated)]
    );
    
    return rows[0] ? this.schema.parse(rows[0]) : null;
  }

  static async delete(id: string) {
    await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
  }
}