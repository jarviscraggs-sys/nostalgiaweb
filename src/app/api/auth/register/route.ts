import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, display_name } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate username
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 chars, lowercase letters, numbers, underscores only' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check existing
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);

    const userId = db.prepare(`
      INSERT INTO users (username, email, password_hash, display_name)
      VALUES (?, ?, ?, ?)
    `).run(username, email, hash, display_name || username).lastInsertRowid as number;

    // Create site
    const siteId = db.prepare(`
      INSERT INTO sites (user_id, username, title, wallpaper, theme_color, bg_color)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, username, `${display_name || username}'s Home Page`, 'bliss', 'blue', '#008080').lastInsertRowid as number;

    // Add default widgets
    db.prepare(`
      INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(siteId, 'about', 'About Me', JSON.stringify({
      text: `Hi! Welcome to my page! I just signed up on NostalgiaWeb 🎉`
    }), 30, 30, 340, 200, 1);

    db.prepare(`
      INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(siteId, 'guestbook', 'Guestbook ✍️', JSON.stringify({}), 30, 250, 340, 200, 2);

    const token = await signToken({ userId: Number(userId), username });

    const response = NextResponse.json({ success: true, username }, { status: 201 });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
