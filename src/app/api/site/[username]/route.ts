import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Site, Widget, GuestbookEntry } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const db = getDb();

    const site = db.prepare('SELECT * FROM sites WHERE username = ? AND is_public = 1').get(username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Record visit
    db.prepare('INSERT INTO site_visits (site_id) VALUES (?)').run(site.id);

    const widgets = db.prepare(
      'SELECT * FROM widgets WHERE site_id = ? ORDER BY z_index ASC'
    ).all(site.id) as Widget[];

    const guestbook = db.prepare(
      'SELECT * FROM guestbook_entries WHERE site_id = ? ORDER BY created_at DESC LIMIT 10'
    ).all(site.id) as GuestbookEntry[];

    const visitCount = (db.prepare(
      'SELECT COUNT(*) as count FROM site_visits WHERE site_id = ?'
    ).get(site.id) as { count: number }).count;

    return NextResponse.json({
      site,
      widgets: widgets.map(w => ({ ...w, content: JSON.parse(w.content_json) })),
      guestbook,
      visitCount,
    });
  } catch (err) {
    console.error('[site/get]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
