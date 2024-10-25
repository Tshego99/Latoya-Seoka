// db.ts
import { drizzle } from 'drizzle-orm/postgres-js'; 
import postgres from 'postgres';
import dotenv from 'dotenv';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

dotenv.config();

// Use environment variable for the connection string
const connectionString = process.env.DATABASE_URL || 
  'postgresql://admin:eJBs5zk0aCivPeOmXnk4QmSvmsFETgDG@dpg-crkjc1m8ii6s7380nno0-a.frankfurt-postgres.render.com/latoya?ssl=true';

// Initialize Postgres.js client with connection string
const queryClient = postgres(connectionString);

// Initialize Drizzle ORM with the Postgres.js client
const db = drizzle(queryClient);

// Console log to inspect the sqlClient object
console.log('SQL Client:', queryClient);
console.log('SQL Client Options:', queryClient.options);

// Define your tables using Drizzle ORM
export const User = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
});

// Connection logic
(async () => {
    try {
        await queryClient.connect();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection error:', error);
    }
})();

// Export the database instance
export default db;
