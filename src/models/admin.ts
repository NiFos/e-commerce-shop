import { database } from '../libs/db';

const adminsTable = 'admins';

/**
 * Admin model
 */
export const adminModel = {
  /**
   * Get all in admins list
   */
  async getAllAdmins(): Promise<any> {
    return await database().select('*').from(adminsTable);
  },

  /**
   * Checking user for existing in admins list
   * @param userId - User id
   */
  async checkIfAdminExist(userId: number): Promise<boolean> {
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
  async addUserToAdmins(userId: number, fullAccess: boolean): Promise<any> {
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
  ): Promise<any> {
    return await database()
      .update({ full_access: fullAccess })
      .where('user_id', '=', userId)
      .from(adminsTable);
  },

  /**
   * Delete user from admins list
   * @param userId - User id
   */
  async deleteAdmin(userId: number): Promise<any> {
    return await database()
      .delete()
      .where('user_id', '=', userId)
      .from(adminsTable);
  },
};
