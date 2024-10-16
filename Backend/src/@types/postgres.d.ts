// postgres.d.ts
declare module 'postgres' {
    // Define the types as per your usage
    export type ClientOptions = {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        // You can add more options if needed, like ssl, idleTimeoutMillis, etc.
    };

    // CreateClient function that returns an instance of a client
    export function createClient(options: ClientOptions): any; // Specify a more specific return type if needed

    // Default export to create a PostgreSQL client with a connection string
    export default function postgres(connectionString: string): any;
}
