import knex from 'knex';

const connectionString = process.env.CONNECTION_STRING || '';
let cachedConnection: knex;

/**
 * Connect to database
 */
export function database(): knex {
  if (cachedConnection) return cachedConnection;
  const connection = knex({
    client: 'pg',
    connection: connectionString,
  });
  cachedConnection = connection;
  return cachedConnection;
}
