import { database } from '../libs/db';

const usersTable = 'users';
export const userModel = {
  /**
   * Search users by username (limited 10 users)
   * @param username - Username to search
   */
  async findUsers(username: number): Promise<any> {
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
    return await database()
      .select('*')
      .from(usersTable)
      .where('user_id', '=', userId)
      .limit(1);
  },
};
