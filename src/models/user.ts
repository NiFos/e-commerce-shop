import { database } from '../libs/db';
import { adminsTable } from './admin';

export interface IUserModel {
  user_id: number;
  username: string;
  created_on: Date;
  delivery_address?: string;
  phone?: string;
  admin?: {
    isAdmin?: boolean;
    fullAccess?: boolean;
  };
}

export const usersTable = 'users';

export const userModel = {
  /**
   * Search users by username (limited 10 users)
   * @param username - Username to search
   */
  async findUsers(username: string): Promise<IUserModel[]> {
    if (!username) return [];
    return await database()
      .select('*')
      .from(usersTable)
      .where('username', 'ilike', `%${username}%`)
      .limit(10);
  },

  /**
   * Find user by id
   * @param userId - User id
   */
  async findUserById(userId: number): Promise<IUserModel[]> {
    if (typeof userId === 'undefined') return [];
    const user = await database()
      .select('*')
      .from(usersTable)
      .where('user_id', '=', userId)
      .limit(1);
    if (user.length <= 0) return [];

    const admin = await database()
      .select('*')
      .from(adminsTable)
      .where('user_id', '=', userId);
    const isAdmin = !!admin[0]?.user_id;

    const response = {
      ...user[0],
      admin: {
        isAdmin,
        fullAccess: admin[0]?.full_access,
      },
    };

    return [response];
  },

  /**
   * Edit user information
   * @param payload - Update payload (phone, deliveryaddress)
   */
  async editUserInformation(
    userId: number,
    payload: { delivery_ddress?: string; phone?: string }
  ): Promise<number> {
    if (JSON.stringify(payload) === '{}') return 0;

    return await database()
      .update(payload)
      .from(usersTable)
      .where('user_id', '=', userId);
  },
};
