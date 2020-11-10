import { NextApiResponse } from 'next';
import { IUser } from './withUser';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { generate } from 'generate-password';

const cookieAge = process.env.COOKIE_EXPIRATION || 31556926;
const jwtAge = process.env.JWT_EXPIRATION || '1y';
const jwtSecret = process.env.JWT_SECRET || 'secret';

const google_client_id = process.env.GCP_OAUTH_CLIENT_ID || '';
const google_client_secret = process.env.GCP_OAUTH_SECRET || '';
const google_redirect_url = process.env.GCP_OAUTH_REDIRECT || '';

const passwordSalt = process.env.PASSWORD_SALT || 10;

/**
 * Create google connection
 */
const createConnectionGoogle = () =>
  new google.auth.OAuth2(
    google_client_id,
    google_client_secret,
    google_redirect_url
  );
const oauth2 = google.oauth2('v2');

export const authUtil = {
  /**
   * Get google oauth url
   */
  async getOauthUrl(): Promise<any> {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const auth = createConnectionGoogle();
    const url = auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope,
    });

    return url;
  },

  /**
   * Get user information (email, etc.)
   * @param token - Code from query
   */
  async getUserInfo(token: string): Promise<any> {
    const auth = createConnectionGoogle();
    const data = await auth.getToken(token);

    auth.setCredentials(data.tokens);
    return await oauth2.userinfo.get({ auth });
  },

  /**
   * Set auth cookie to res
   * @param res Response
   */
  setAuthCookie(res: NextApiResponse, cookie: string): any {
    res.setHeader('Set-Cookie', [cookie]);
  },

  /**
   * Gen cookie with payload
   * @param payload - Payload object (user)
   */
  genCookie(payload: IUser): string {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtAge,
    });
    const cookie = serialize('authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: +cookieAge,
    });
    return cookie;
  },

  /**
   * Generate password
   */
  genPassword() {
    const password = generate({
      length: +passwordSalt,
      numbers: true,
    });
    return password;
  },
};
