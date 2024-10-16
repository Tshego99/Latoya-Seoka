import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js'; 
import { User } from './models/user';  
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { pgTable, serial, text, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

// Load environment variables from .env file
dotenv.config();

const app = new Hono();

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
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle(queryClient);

// Define the FoodItem table schema correctly
const foodItemsTable = pgTable('foodItems', {
    id: serial('id').primaryKey(),
    name: text('name'),
    quantity: integer('quantity').notNull().default(1), // Assuming quantity is defined in your schema
    price: decimal('price').notNull(),
    ingredients: jsonb('ingredients').notNull(),
    colorClass: text('colorClass'),
});

// Simple test route
app.get('/', (c) => {
    return c.json({ message: 'Welcome to the ChefApp API!' });
});

// Registration route with logging
app.post('/register', async (c) => {
    console.log('Received a request at /register');
    const { username, password } = await c.req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(User).values({ username, password: hashedPassword });
    return c.json({ message: 'User registered successfully' });
});

// Login route with logging
app.post('/login', async (c) => {
    console.log('Received a request at /login');
    const { username, password } = await c.req.json();
    const users = await db.select()
        .from(User)
        .where(eq(User.username, username))
        .limit(1);

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return c.json({ message: "Invalid credentials" }, 401);
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    return c.json({ token });
});

// Routes

// GET /foodItems - Retrieve all food items
app.get('/foodItems', async (c) => {
    try {
        const items = await db.select().from(foodItemsTable).execute();
        return c.json(items);
    } catch (error) {
        console.error('Error fetching food items:', error);
        return c.json({ error: 'Failed to fetch food items' }, 500);
    }
});

// POST /foodItems - Add a new food item
app.post('/foodItems', async (c) => {
    const { name, price, ingredients } = await c.req.json();

    // Basic input validation
    if (!name || typeof price !== 'number' || !Array.isArray(ingredients)) {
        return c.json({ error: 'Invalid input data' }, 400);
    }

    try {
        const colorClass = determineColorClass(name);

        // Ensure that price is converted to a string if your schema expects it that way
        const newItem = await db.insert(foodItemsTable).values({
            name: name as string, // Ensure name is a string
            price: price.toString() as string, // Convert price to string if needed
            quantity: 1, // Use a default value for quantity
            ingredients: JSON.stringify(ingredients), // Ensure ingredients is in the correct format
            colorClass: colorClass as string, // Ensure colorClass is a string
        }).returning().execute();
        
        return c.json(newItem, 201);
    } catch (error) {
        console.error('Error adding food item:', error);
        return c.json({ error: 'Failed to add food item' }, 500);
    }
});


// PUT /foodItems/:id - Update an existing food item
app.put('/foodItems/:id', async (c) => {
    const id = c.req.param('id');
    const { name, price, ingredients } = await c.req.json();

    // Basic input validation
    if (!name || typeof price !== 'number' || !Array.isArray(ingredients)) {
        return c.json({ error: 'Invalid input data' }, 400);
    }

    try {
        const colorClass = determineColorClass(name);
        await db.update(foodItemsTable)
            .set({
                name,
                price: price.toString(), // Convert price to string if needed
                quantity: 1, // Update quantity if needed
                ingredients: JSON.stringify(ingredients),
                colorClass,
            })
            .where(eq(foodItemsTable.id, Number(id))) // Use eq for the condition
            .execute();

        return c.json({ message: 'Food item updated successfully' });
    } catch (error) {
        console.error('Error updating food item:', error);
        return c.json({ error: 'Failed to update food item' }, 500);
    }
});


// DELETE /foodItems/:id - Delete a food item
app.delete('/foodItems/:id', async (c) => {
    const id = c.req.param('id');
    try {
        await db.delete(foodItemsTable)
            .where(eq(foodItemsTable.id, Number(id))) // Use eq for the condition
            .execute();
        
        return c.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        console.error('Error deleting food item:', error);
        return c.json({ error: 'Failed to delete food item' }, 500);
    }
});


// Function to determine color class based on the item's name
const determineColorClass = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('chicken')) {
        return 'chicken-kota';
    } else if (lowerName.includes('beef')) {
        return 'beef-kota';
    } else if (lowerName.includes('veggie')) {
        return 'veggie-kota';
    } else {
        return '';
    }
};

// Start the server
serve(app);
console.log('Server is running on http://localhost:3000');
