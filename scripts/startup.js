#!/usr/bin/env node
'use strict';

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'nostalgiaweb.db');
console.log('[startup] Using DB at:', DB_PATH);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    username     TEXT    NOT NULL UNIQUE,
    email        TEXT    NOT NULL UNIQUE,
    password_hash TEXT   NOT NULL,
    display_name TEXT    NOT NULL DEFAULT '',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sites (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id),
    username     TEXT    NOT NULL UNIQUE,
    title        TEXT    NOT NULL DEFAULT 'My Home Page',
    wallpaper    TEXT    NOT NULL DEFAULT 'bliss',
    theme_color  TEXT    NOT NULL DEFAULT 'blue',
    midi_url     TEXT    NOT NULL DEFAULT '',
    bg_color     TEXT    NOT NULL DEFAULT '#008080',
    is_public    INTEGER NOT NULL DEFAULT 1,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS widgets (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id      INTEGER NOT NULL REFERENCES sites(id),
    type         TEXT    NOT NULL,
    title        TEXT    NOT NULL DEFAULT '',
    content_json TEXT    NOT NULL DEFAULT '{}',
    x            INTEGER NOT NULL DEFAULT 50,
    y            INTEGER NOT NULL DEFAULT 50,
    width        INTEGER NOT NULL DEFAULT 300,
    height       INTEGER NOT NULL DEFAULT 200,
    z_index      INTEGER NOT NULL DEFAULT 1,
    minimized    INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS guestbook_entries (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id      INTEGER NOT NULL REFERENCES sites(id),
    author_name  TEXT    NOT NULL,
    author_url   TEXT    NOT NULL DEFAULT '',
    message      TEXT    NOT NULL,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_visits (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id      INTEGER NOT NULL REFERENCES sites(id),
    visited_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed demo account ─────────────────────────────────────────────────────────
const existingDemo = db.prepare('SELECT id FROM users WHERE username = ?').get('demo');

if (!existingDemo) {
  console.log('[startup] Seeding demo account...');

  const hash = bcrypt.hashSync('demo123', 10);

  const userId = db.prepare(`
    INSERT INTO users (username, email, password_hash, display_name)
    VALUES (?, ?, ?, ?)
  `).run('demo', 'demo@nostalgiaweb.co.uk', hash, 'Demo User').lastInsertRowid;

  const siteId = db.prepare(`
    INSERT INTO sites (user_id, username, title, wallpaper, theme_color, bg_color)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, 'demo', "Demo's Home Page 🌐", 'bliss', 'blue', '#008080').lastInsertRowid;

  // About widget
  db.prepare(`
    INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(siteId, 'about', 'About Me', JSON.stringify({
    text: "Hi! Welcome to my homepage! 😊\n\nI'm Demo User and this is my little corner of the internet. I love music, coding, and retro aesthetics.\n\nThanks for visiting! Sign my guestbook!"
  }), 20, 20, 340, 220, 1);

  // Now Playing widget
  db.prepare(`
    INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(siteId, 'now_playing', 'Now Playing 🎵', JSON.stringify({
    song: 'Numb',
    artist: 'Linkin Park'
  }), 380, 20, 280, 120, 2);

  // Links widget
  db.prepare(`
    INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(siteId, 'links', 'My Fav Links 🔗', JSON.stringify({
    links: [
      { title: 'Google', url: 'https://google.com' },
      { title: 'Wikipedia', url: 'https://wikipedia.org' },
      { title: 'YouTube', url: 'https://youtube.com' },
      { title: 'Internet Archive', url: 'https://archive.org' }
    ]
  }), 380, 160, 280, 200, 3);

  // Guestbook widget
  db.prepare(`
    INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(siteId, 'guestbook', 'Guestbook ✍️', JSON.stringify({}), 20, 260, 340, 220, 4);

  // Seed a couple of guestbook entries
  db.prepare(`
    INSERT INTO guestbook_entries (site_id, author_name, author_url, message)
    VALUES (?, ?, ?, ?)
  `).run(siteId, 'Alice', 'https://alice.example.com', 'Cool site!! Adding you to my favourites 🌟');

  db.prepare(`
    INSERT INTO guestbook_entries (site_id, author_name, author_url, message)
    VALUES (?, ?, ?, ?)
  `).run(siteId, 'Bob', '', 'ur page is awesome!! luv the winamp vibes 🎵');

  console.log('[startup] Demo account seeded ✓');
} else {
  console.log('[startup] Demo account already exists, skipping seed.');
}

db.close();
console.log('[startup] Database ready ✓');
