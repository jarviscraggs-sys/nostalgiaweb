import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Site } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { author_name, author_url, message } = await req.json();

    if (!author_name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 });
    }

    const db = getDb();
    const site = db.prepare('SELECT * FROM sites WHERE username = ? AND is_public = 1').get(username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    db.prepare(`
      INSERT INTO guestbook_entries (site_id, author_name, author_url, message)
      VALUES (?, ?, ?, ?)
    `).run(site.id, author_name.slice(0, 100), (author_url || '').slice(0, 200), message.slice(0, 500));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[guestbook/post]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
