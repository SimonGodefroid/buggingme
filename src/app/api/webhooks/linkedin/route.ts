import { auth } from '@/auth';
import db from '@/db';
import { isAdmin } from '@/helpers';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !isAdmin(user)) return Response.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { title, imageUrl, description, id, company } = await req.json();
    if (!id) return Response.json({ error: 'Missing report ID' }, { status: 400 });

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const reportUrl = `${protocol}://${host}/reports/${id}`;

    // Send LinkedIn Webhook
    const res = await fetch(process.env.LINKEDIN_WEBHOOK_N8N!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, imageUrl, url: reportUrl, company }),
    });

    // Update report in DB
    try {
      await db.report.update({
        where: { id },
        data: { notifiedAt: new Date() },
      });
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      return Response.json({ success: false, error: 'Database update failed' }, { status: 500 });
    }

    revalidatePath(`/reports/${id}`);
    return Response.json({ success: res.ok });
  } catch (err) {
    console.error('Unexpected error:', err);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
