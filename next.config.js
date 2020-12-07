/* eslint-disable no-undef */
const localeSubpaths = {};
module.exports = {
  publicRuntimeConfig: {
    localeSubpaths,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    COOKIE_EXPIRATION: process.env.COOKIE_EXPIRATION,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SUCCESS_URL: process.env.STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL: process.env.STRIPE_CANCEL_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GCP_OAUTH_CLIENT_ID: process.env.GCP_OAUTH_CLIENT_ID,
    GCP_OAUTH_SECRET: process.env.GCP_OAUTH_SECRET,
    GCP_OAUTH_REDIRECT: process.env.GCP_OAUTH_REDIRECT,
    GCP_BUCKET: process.env.GCP_BUCKET,
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL,
    GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY,
  },
};
