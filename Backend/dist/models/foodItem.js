"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodItemsTable = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const pg_core_1 = require("drizzle-orm/pg-core");
// Initialize Postgres.js client with the connection string
const queryClient = (0, postgres_1.default)('postgresql://admin:eJBs5zk0aCivPeOmXnk4QmSvmsFETgDG@dpg-crkjc1m8ii6s7380nno0-a.frankfurt-postgres.render.com/latoya');
// Initialize Drizzle ORM with the Postgres.js client
const db = (0, postgres_js_1.drizzle)(queryClient);
exports.foodItemsTable = (0, pg_core_1.pgTable)('foodItems', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1),
    price: (0, pg_core_1.decimal)('price').notNull(), // Ensure this is defined as decimal
    ingredients: (0, pg_core_1.jsonb)('ingredients').notNull(),
    colorClass: (0, pg_core_1.text)('colorClass'),
});
// Export the database instance
exports.default = db;
