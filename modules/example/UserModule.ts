import { z } from 'zod';
import { BaseModel } from '../../src/lib/base/BaseModel';

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class UserModel extends BaseModel {
  protected static tableName = 'users';
  protected static schema = userSchema;

  // Custom methods for User module
  static async findByEmail(email: string) {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE email = $1`,
      [email]
    );
    return rows[0] ? this.schema.parse(rows[0]) : null;
  }

  static async updateRole(id: string, role: 'USER' | 'ADMIN') {
    const { rows } = await pool.query(
      `UPDATE ${this.tableName} SET role = $2 WHERE id = $1 RETURNING *`,
      [id, role]
    );
    return rows[0] ? this.schema.parse(rows[0]) : null;
  }
}