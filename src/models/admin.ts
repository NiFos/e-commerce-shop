import { database } from '../libs/db';
import { usersTable } from './user';

export interface IAdmin {
  user_id: number;
  username?: string;
  full_access: boolean;
  created_on: string;
}

export const adminsTable = 'admins';

/**
 * Admin model
 */
export const adminModel = {
  /**
   * Get all in admins list
   */
  async getAllAdmins(): Promise<IAdmin[]> {
    return await database()
      .select('*')
      .from(adminsTable)
      .innerJoin(usersTable, `${usersTable}.user_id`, `${adminsTable}.user_id`);
  },

  /**
   * Checking user for existing in admins list
   * @param userId - User id
   */
  async checkIfAdminExist(userId: number): Promise<boolean> {
    if (typeof userId === 'undefined') return false;
    const response = await database()
      .select('*')
      .from(adminsTable)
      .where('user_id', '=', userId)
      .limit(1);
    return !!response[0].user_id;
  },

  /**
   * Adding user to admins list
   * @param userId - User id
   * @param fullAccess - level of access for user (false - only view permissions, true - full access)
   */
  async addUserToAdmins(
    userId: number,
    fullAccess: boolean
  ): Promise<IAdmin[]> {
    if (typeof userId === 'undefined') return [];
    return await database()
      .insert({
        user_id: userId,
        full_access: fullAccess,
      })
      .into(adminsTable)
      .returning('*');
  },

  /**
   * Edit admin level of access
   * @param userId - User id
   * @param fullAccess - level of access for user (false - only view permissions, true - full access)
   */
  async editAdminAccessLevel(
    userId: number,
    fullAccess: boolean
  ): Promise<number> {
    if (typeof userId === 'undefined') return 0;
    return await database()
      .update({ full_access: fullAccess })
      .where('user_id', '=', userId)
      .from(adminsTable);
  },

  /**
   * Delete user from admins list
   * @param userId - User id
   */
  async deleteAdmin(userId: number): Promise<number> {
    if (typeof userId === 'undefined') return 0;
    return await database()
      .delete()
      .where('user_id', '=', userId)
      .from(adminsTable);
  },
};
