import { MongoClient } from "mongodb";

// Cache the client across hot-reloads / lambda invocations so we don't open a
// new connection pool on every request.
let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

export async function getDb() {
    const MONGO_URL = process.env.MONGO_URL;
    const DB_NAME = process.env.DB_NAME;
    if (!MONGO_URL) throw new Error("MONGO_URL is not set");
    if (!DB_NAME) throw new Error("DB_NAME is not set");

    if (cached.client) return cached.client.db(DB_NAME);
    if (!cached.promise) {
        cached.promise = new MongoClient(MONGO_URL).connect();
    }
    cached.client = await cached.promise;
    return cached.client.db(DB_NAME);
}
