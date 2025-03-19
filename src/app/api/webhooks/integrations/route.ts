import { auth } from '@/auth';
import db from '@/db';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const { title, imageUrl, description, id, reportId, companyId } = await req.json();
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!reportId || !companyId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { issueTracker: true },
    });

    if (!company?.issueTracker) {
      return Response.json({ error: 'No issue tracker configured' }, { status: 400 });
    }

    // Store dispatch record
    const dispatch = await db.reportDispatch.create({
      data: {
        reportId,
        issueTracker: company.issueTracker,
        dispatchedBy: session.user.id,
        status: 'Pending',
      },
    });
    console.log('Dispatch', dispatch)
    // Send Webhook to n8n


    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const reportUrl = `${protocol}://${host}/reports/${id}`;

    const res = await fetch(process.env.INTEGRATIONS_WEBHOOK_N8N!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId,
        companyId,
        dispatchId: dispatch.id,
        title, description, imageUrl, url: reportUrl, company
      }),
    });

    console.log('res', res)

    if (!res.ok) {
      throw new Error('Webhook failed');
    }

    await db.report.update({
      where: { id: reportId },
      data: { notifiedAt: new Date() },
    });

    revalidatePath(`/reports/${reportId}`);
    return Response.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 502 });
  }
}
