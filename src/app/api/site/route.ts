import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import type { Site } from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const site = db.prepare('SELECT * FROM sites WHERE username = ?').get(authUser.username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const widgets = db.prepare(
      'SELECT * FROM widgets WHERE site_id = ? ORDER BY z_index ASC'
    ).all(site.id);

    return NextResponse.json({
      site,
      widgets: (widgets as Array<{ content_json: string } & Record<string, unknown>>).map(w => ({
        ...w,
        content: JSON.parse(w.content_json as string),
      })),
    });
  } catch (err) {
    console.error('[site/get-mine]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, wallpaper, theme_color, midi_url, bg_color } = await req.json();

    const db = getDb();
    db.prepare(`
      UPDATE sites
      SET title = ?, wallpaper = ?, theme_color = ?, midi_url = ?, bg_color = ?, updated_at = datetime('now')
      WHERE username = ?
    `).run(title, wallpaper, theme_color, midi_url || '', bg_color || '#008080', authUser.username);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[site/put]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
