import postgres from "pg";
import dotenv from "dotenv";
// import * as schema from "./schema";

dotenv.config();

const connection = new postgres.Pool({
	database: process.env.DATABASE,
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	port: Number(process.env.DATABASE_PORT!),
	password: process.env.DATABASE_PASSWORD,
});

export async function initializeDB() {
	try {
		await connection.connect();
		// await connection.query("BEGIN");
		// await connection.query(schema.ProductSchema);
		// await connection.query(schema.TransactionSchema);
		// connection.query("DROP TABLE Products");
		// connection.query("DROP TABLE Transactions");
		// await connection.query("COMMIT");
		console.log("✅ Connected to database");
	} catch (error: any) {
		console.log("❌ [ERROR!] Database Connection", error.message);
	}
}

export default connection;
