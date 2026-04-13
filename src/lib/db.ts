import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'nostalgiaweb.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

export type User = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  created_at: string;
};

export type Site = {
  id: number;
  user_id: number;
  username: string;
  title: string;
  wallpaper: string;
  theme_color: string;
  midi_url: string;
  bg_color: string;
  is_public: number;
  created_at: string;
  updated_at: string;
};

export type Widget = {
  id: number;
  site_id: number;
  type: string;
  title: string;
  content_json: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  minimized: number;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  site_id: number;
  author_name: string;
  author_url: string;
  message: string;
  created_at: string;
};
