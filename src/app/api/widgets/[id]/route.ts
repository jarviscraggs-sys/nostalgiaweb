import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import type { Site, Widget } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const db = getDb();
    const site = db.prepare('SELECT * FROM sites WHERE username = ?').get(authUser.username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const widget = db.prepare('SELECT * FROM widgets WHERE id = ? AND site_id = ?').get(id, site.id) as Widget | undefined;
    if (!widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.title !== undefined) { updates.push('title = ?'); values.push(body.title); }
    if (body.content !== undefined) { updates.push('content_json = ?'); values.push(JSON.stringify(body.content)); }
    if (body.x !== undefined) { updates.push('x = ?'); values.push(body.x); }
    if (body.y !== undefined) { updates.push('y = ?'); values.push(body.y); }
    if (body.width !== undefined) { updates.push('width = ?'); values.push(body.width); }
    if (body.height !== undefined) { updates.push('height = ?'); values.push(body.height); }
    if (body.z_index !== undefined) { updates.push('z_index = ?'); values.push(body.z_index); }
    if (body.minimized !== undefined) { updates.push('minimized = ?'); values.push(body.minimized ? 1 : 0); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    values.push(id, site.id);
    db.prepare(`UPDATE widgets SET ${updates.join(', ')} WHERE id = ? AND site_id = ?`).run(...values);

    const updated = db.prepare('SELECT * FROM widgets WHERE id = ?').get(id) as Widget;
    return NextResponse.json({ ...updated, content: JSON.parse(updated.content_json) });
  } catch (err) {
    console.error('[widgets/put]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const site = db.prepare('SELECT * FROM sites WHERE username = ?').get(authUser.username) as Site | undefined;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const result = db.prepare('DELETE FROM widgets WHERE id = ? AND site_id = ?').run(id, site.id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[widgets/delete]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
