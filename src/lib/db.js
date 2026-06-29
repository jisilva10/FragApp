import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Helper to ensure database directory exists (if we put it in a specific folder)
// For now, they are at the root of the project
const FRAGRANTICA_DB_PATH = path.join(process.cwd(), 'fragrantica.db');
const USER_DB_PATH = path.join(process.cwd(), 'user_data.db');

let fragranticaDb;
let userDb;

export function getFragranticaDb() {
  if (!fragranticaDb) {
    fragranticaDb = new Database(FRAGRANTICA_DB_PATH, { readonly: true });
  }
  return fragranticaDb;
}

export function getUserDb() {
  if (!userDb) {
    const isNew = !fs.existsSync(USER_DB_PATH);
    userDb = new Database(USER_DB_PATH);
    
    if (isNew) {
      // Initialize tables for User DB
      
      // Wardrobe: Perfumes owned by the user
      userDb.exec(`
        CREATE TABLE wardrobe (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          perfume_id INTEGER,
          name TEXT,
          brand TEXT,
          notes TEXT,           -- User's personal notes (climate, longevity)
          occasions TEXT,       -- E.g., 'Office', 'Date Night'
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Lists: Wishlist, Likes, Dislikes, Alternatives
      userDb.exec(`
        CREATE TABLE lists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          perfume_id INTEGER,
          name TEXT,
          brand TEXT,
          list_type TEXT,       -- 'wishlist', 'like', 'dislike', 'alternative'
          comparison_to INTEGER,-- ID of another perfume this is an alternative to
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  }
  return userDb;
}
