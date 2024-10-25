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
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const user_1 = require("./models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
// Load environment variables from .env file
dotenv_1.default.config();
const app = new hono_1.Hono();
// Enable CORS for all routes
app.use('*', (c, next) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Frontend URL
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    return next(); // Proceed to the next middleware
});
// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the .env file");
}
// Initialize PostgreSQL client and Drizzle ORM
const queryClient = (0, postgres_1.default)(process.env.DATABASE_URL);
const db = (0, postgres_js_1.drizzle)(queryClient);
// Define the FoodItem table schema correctly
const foodItemsTable = (0, pg_core_1.pgTable)('foodItems', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name'),
    quantity: (0, pg_core_1.integer)('quantity').notNull().default(1), // Assuming quantity is defined in your schema
    price: (0, pg_core_1.decimal)('price').notNull(),
    ingredients: (0, pg_core_1.jsonb)('ingredients').notNull(),
    colorClass: (0, pg_core_1.text)('colorClass'),
});
// Simple test route
app.get('/', (c) => {
    return c.json({ message: 'Welcome to the ChefApp API!' });
});
// Registration route with logging
app.post('/register', (c) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received a request at /register');
    const { username, password } = yield c.req.json();
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield db.insert(user_1.User).values({ username, password: hashedPassword });
    return c.json({ message: 'User registered successfully' });
}));
// Login route with logging
app.post('/login', (c) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received a request at /login');
    const { username, password } = yield c.req.json();
    const users = yield db.select()
        .from(user_1.User)
        .where((0, drizzle_orm_1.eq)(user_1.User.username, username))
        .limit(1);
    const user = users[0];
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        return c.json({ message: "Invalid credentials" }, 401);
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    return c.json({ token });
}));
// Routes
// GET /foodItems - Retrieve all food items
app.get('/foodItems', (c) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield db.select().from(foodItemsTable).execute();
        return c.json(items);
    }
    catch (error) {
        console.error('Error fetching food items:', error);
        return c.json({ error: 'Failed to fetch food items' }, 500);
    }
}));
// POST /foodItems - Add a new food item
app.post('/foodItems', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, ingredients } = yield c.req.json();
    // Basic input validation
    if (!name || typeof price !== 'number' || !Array.isArray(ingredients)) {
        return c.json({ error: 'Invalid input data' }, 400);
    }
    try {
        const colorClass = determineColorClass(name);
        // Ensure that price is converted to a string if your schema expects it that way
        const newItem = yield db.insert(foodItemsTable).values({
            name: name, // Ensure name is a string
            price: price.toString(), // Convert price to string if needed
            quantity: 1, // Use a default value for quantity
            ingredients: JSON.stringify(ingredients), // Ensure ingredients is in the correct format
            colorClass: colorClass, // Ensure colorClass is a string
        }).returning().execute();
        return c.json(newItem, 201);
    }
    catch (error) {
        console.error('Error adding food item:', error);
        return c.json({ error: 'Failed to add food item' }, 500);
    }
}));
// PUT /foodItems/:id - Update an existing food item
app.put('/foodItems/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const id = c.req.param('id');
    const { name, price, ingredients } = yield c.req.json();
    // Basic input validation
    if (!name || typeof price !== 'number' || !Array.isArray(ingredients)) {
        return c.json({ error: 'Invalid input data' }, 400);
    }
    try {
        const colorClass = determineColorClass(name);
        yield db.update(foodItemsTable)
            .set({
            name,
            price: price.toString(), // Convert price to string if needed
            quantity: 1, // Update quantity if needed
            ingredients: JSON.stringify(ingredients),
            colorClass,
        })
            .where((0, drizzle_orm_1.eq)(foodItemsTable.id, Number(id))) // Use eq for the condition
            .execute();
        return c.json({ message: 'Food item updated successfully' });
    }
    catch (error) {
        console.error('Error updating food item:', error);
        return c.json({ error: 'Failed to update food item' }, 500);
    }
}));
// DELETE /foodItems/:id - Delete a food item
app.delete('/foodItems/:id', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const id = c.req.param('id');
    try {
        yield db.delete(foodItemsTable)
            .where((0, drizzle_orm_1.eq)(foodItemsTable.id, Number(id))) // Use eq for the condition
            .execute();
        return c.json({ message: 'Food item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting food item:', error);
        return c.json({ error: 'Failed to delete food item' }, 500);
    }
}));
// Function to determine color class based on the item's name
const determineColorClass = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('chicken')) {
        return 'chicken-kota';
    }
    else if (lowerName.includes('beef')) {
        return 'beef-kota';
    }
    else if (lowerName.includes('veggie')) {
        return 'veggie-kota';
    }
    else {
        return '';
    }
};
// Start the server
(0, node_server_1.serve)(app);
console.log('Server is running on http://localhost:3000');
