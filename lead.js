// Vercel Serverless Function — recibe el lead del calificador y lo reenvía.
// Configurar en Vercel → Settings → Environment Variables:
//   LEAD_WEBHOOK_URL = URL de Zapier / Make / Google Apps Script / tu CRM
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  const lead = {
    nombre: String(body.nombre || '').slice(0, 120),
    telefono: String(body.telefono || '').slice(0, 40),
    monto: String(body.monto || '').slice(0, 60),
    situacion: String(body.situacion || '').slice(0, 120),
    mensaje: String(body.mensaje || '').slice(0, 600),
    url: String(body.url || '').slice(0, 300),
    ref: String(body.ref || '').slice(0, 300),
    ts: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || null,
  };

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (!hook) { console.log('LEAD (sin LEAD_WEBHOOK_URL configurado):', lead); return res.status(200).json({ ok: true, stored: false }); }

  try {
    await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
    return res.status(200).json({ ok: true, stored: true });
  } catch (e) {
    console.error('LEAD forward error', e);
    return res.status(200).json({ ok: true, stored: false });
  }
}
