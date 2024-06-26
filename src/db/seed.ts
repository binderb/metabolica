import dotenv from 'dotenv';
import { users } from "./schema";
import bcrypt from 'bcrypt';
dotenv.config({path: '.env.local'});
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';


async function main () {

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, {schema: schema});
  const data:(typeof users.$inferInsert)[] = [];
  data.push({
    username: process.env.POSTGRES_SEED_USERNAME!,
    password: await bcrypt.hash(process.env.POSTGRES_SEED_PASSWORD || '', 10),
    first: process.env.POSTGRES_SEED_FIRST!,
    last: process.env.POSTGRES_SEED_LAST!,
    role: process.env.POSTGRES_SEED_ROLE!,
  });

  console.log('Seed start...');
  await db.insert(users).values(data);
  console.log('Seed finished!');
  process.exit(0);
}

main().catch((err) => {
  console.log(err);
  process.exit(0);
});