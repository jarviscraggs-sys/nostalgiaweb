import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import type { Site } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, content, x, y, width, height } = await req.json();

    if (!type) {
      return NextResponse.json({ error: 'Widget type required' }, { status: 400 });
    }

    const db = getDb();
    const site = db.prepare('SELECT * FROM sites WHERE username = ?').get(authUser.username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Get max z_index
    const maxZ = (db.prepare('SELECT MAX(z_index) as mz FROM widgets WHERE site_id = ?').get(site.id) as { mz: number | null }).mz || 0;

    const defaultContent: Record<string, unknown> = {
      about: { text: 'Write something about yourself...' },
      photos: { photos: [] },
      guestbook: {},
      now_playing: { song: 'Song Title', artist: 'Artist Name' },
      links: { links: [] },
      hit_counter: {},
    };

    const defaultTitles: Record<string, string> = {
      about: 'About Me',
      photos: 'My Photos',
      guestbook: 'Guestbook ✍️',
      now_playing: 'Now Playing 🎵',
      links: 'My Links 🔗',
      hit_counter: 'Hit Counter',
    };

    const defaultSizes: Record<string, { w: number; h: number }> = {
      about: { w: 340, h: 220 },
      photos: { w: 360, h: 280 },
      guestbook: { w: 340, h: 220 },
      now_playing: { w: 280, h: 120 },
      links: { w: 280, h: 200 },
      hit_counter: { w: 200, h: 100 },
    };

    const sz = defaultSizes[type] || { w: 300, h: 200 };

    const widgetId = db.prepare(`
      INSERT INTO widgets (site_id, type, title, content_json, x, y, width, height, z_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      site.id,
      type,
      title || defaultTitles[type] || type,
      JSON.stringify(content || defaultContent[type] || {}),
      x ?? 60,
      y ?? 60,
      width || sz.w,
      height || sz.h,
      maxZ + 1
    ).lastInsertRowid;

    const widget = db.prepare('SELECT * FROM widgets WHERE id = ?').get(widgetId) as Record<string, unknown>;

    return NextResponse.json({
      ...widget,
      content: JSON.parse(widget.content_json as string),
    }, { status: 201 });
  } catch (err) {
    console.error('[widgets/post]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
