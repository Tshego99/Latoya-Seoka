import { drizzle } from 'drizzle-orm/postgres-js'; 
import postgres from 'postgres';
import { pgTable, serial, text, integer, decimal, jsonb} from 'drizzle-orm/pg-core';

// Initialize Postgres.js client with the connection string
const queryClient = postgres('postgresql://admin:eJBs5zk0aCivPeOmXnk4QmSvmsFETgDG@dpg-crkjc1m8ii6s7380nno0-a.frankfurt-postgres.render.com/latoya');

// Initialize Drizzle ORM with the Postgres.js client
const db = drizzle(queryClient);

export const foodItemsTable = pgTable('foodItems', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: decimal('price').notNull(), // Ensure this is defined as decimal
  ingredients: jsonb('ingredients').notNull(),
  colorClass: text('colorClass'),
});

// Export the database instance
export default db;
