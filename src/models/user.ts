import { database } from '../libs/db';

const usersTable = 'users';
const adminsTable = 'admins';
export const userModel = {
  /**
   * Search users by username (limited 10 users)
   * @param username - Username to search
   */
  async findUsers(username: string): Promise<any> {
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
  async findUserById(userId: number): Promise<any> {
    if (typeof userId === 'undefined') return [];
    const user = await database()
      .select('*')
      .from(usersTable)
      .where('user_id', '=', userId)
      .limit(1);
    if (!user[0]?.user_id) return [];

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
  async editUserInformation(userId: number, payload: any) {
    if (JSON.stringify(payload) === '{}') return 0;

    return await database()
      .update(payload)
      .from(usersTable)
      .where('user_id', '=', userId);
  },
};
