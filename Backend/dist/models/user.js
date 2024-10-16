"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// db.ts
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_core_1 = require("drizzle-orm/pg-core");
dotenv_1.default.config();
// Use environment variable for the connection string
const connectionString = process.env.DATABASE_URL ||
    'postgresql://admin:eJBs5zk0aCivPeOmXnk4QmSvmsFETgDG@dpg-crkjc1m8ii6s7380nno0-a.frankfurt-postgres.render.com/latoya?ssl=true';
// Initialize Postgres.js client with connection string
const queryClient = (0, postgres_1.default)(connectionString);
// Initialize Drizzle ORM with the Postgres.js client
const db = (0, postgres_js_1.drizzle)(queryClient);
// Console log to inspect the sqlClient object
console.log('SQL Client:', queryClient);
console.log('SQL Client Options:', queryClient.options);
// Define your tables using Drizzle ORM
exports.User = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    username: (0, pg_core_1.text)('username').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
});
// Connection logic
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryClient.connect();
        console.log('Database connected successfully!');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
}))();
// Export the database instance
exports.default = db;
