import { MongoClient } from "mongodb";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL is not set in environment");
  process.exit(1);
}

// Mask password for display
const maskedUrl = url.replace(/:([^:@]+)@/, ":****@");
console.log(`Testing connection to: ${maskedUrl}`);

try {
  const client = new MongoClient(url, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("✅ Successfully connected to MongoDB Atlas");
  await client.close();
} catch (err) {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
}