import { database } from '../libs/db';
import { compare, hash } from 'bcrypt';
import { userModel, usersTable } from './user';

const cookieTable = 'users_cookie';
const usersCredentialsTable = 'users_credentials';
const salt = process.env.PASSWORD_SALT || 10;

export const authModel = {
  /**
   * Check is user exist
   * @param email - User email
   */
  async isUserExist(email: string): Promise<string> {
    const response = await database()
      .select('*')
      .from(usersCredentialsTable)
      .where({ email });
    if (!response[0]?.user_id) return '';
    return response[0].user_id;
  },

  /**
   * Login with email/password
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<any> {
    const response = await database()
      .select('*')
      .from(usersCredentialsTable)
      .where({ email });

    if (!response[0]?.user_id) return [];

    const isPasswordsEquals = await compare(password, response[0].password);
    if (!isPasswordsEquals) return [];

    const user = await userModel.findUserById(response[0].user_id);
    if (!user[0]?.user_id) return [];

    return user;
  },

  /**
   * Register user
   * @param email - User email
   * @param username - User username
   * @param password - User password
   */
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<any> {
    const isExist = await authModel.isUserExist(email);
    if (typeof isExist === 'undefined') return [];

    const regResponse = await database()
      .insert({ username })
      .into(usersTable)
      .returning('*');
    if (!regResponse[0]?.user_id) return [];
    const hashedPassword = await hash(password, +salt);
    const credentialsResponse = await database()
      .insert({
        user_id: regResponse[0].user_id,
        email,
        password: hashedPassword,
      })
      .into(usersCredentialsTable)
      .returning('*');
    if (!credentialsResponse[0]?.user_id) {
      await database()
        .delete()
        .from(usersTable)
        .where('user_id', '=', regResponse[0].user_id);
      return [];
    }
    return regResponse;
  },

  /**
   * Check is token exist and return user_id
   * @param token - Cookie token
   */
  async getCookieUser(token: string): Promise<string> {
    const response = await database()
      .select('*')
      .from(cookieTable)
      .where('token', '=', token);
    if (!response[0]?.user_id) return '';
    return response[0].user_id;
  },

  /**
   * Set(update) cookie in db
   * @param userId - User id
   * @param mod - Is update or new cookie
   * @param cookie - New cookie
   */
  async setCookieInDb(
    userId: number,
    mod: boolean,
    cookie: string
  ): Promise<boolean> {
    if (mod) {
      const response = await database()
        .update({ cookie })
        .where('user_id', '=', userId);
      return response > 0;
    }
    const response = await database()
      .insert({ user_id: userId, cookie })
      .into(cookieTable)
      .returning('*');
    return !!response[0].user_id;
  },
};
