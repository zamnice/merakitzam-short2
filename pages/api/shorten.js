// pages/api/shorten.js
export default async function handler(req, res) {
  const GS = process.env.GS_SCRIPT_URL;
  const PW = process.env.PW_LINK;
  const SECRET = process.env.SECRET_TOKEN;

  if (!GS) return res.status(500).json({ ok:false, message:"GS_SCRIPT_URL not configured" });

  if (req.method !== 'POST') return res.status(405).json({ ok:false, message:"Method not allowed" });

  const body = req.body || {};
  const action = body.action || 'create';

  // special: check password (from UI)
  if (action === 'checkpw') {
    const input = body.pw || '';
    if (input === PW) return res.status(200).json({ ok:true });
    else return res.status(401).json({ ok:false, message:'Wrong password' });
  }

  // admin actions require cookie or server-side PW
  const cookies = req.headers.cookie || '';
  const hasAuthCookie = cookies.split('; ').some(c=>c.startsWith('pz_auth='));
  if (action === 'list' || action === 'delete' || action === 'update') {
    if (!hasAuthCookie && body._serverPW !== PW) {
      return res.status(401).json({ ok:false, message:'Not authorized' });
    }
  }

  // prepare payload to Apps Script
  const payload = { action };
  if (action === 'create') {
    const code = (body.code || '').trim();
    const url = (body.url || '').trim();
    if (!code || !url) return res.status(400).json({ ok:false, message:"Missing code or url" });
    payload.code = code; payload.url = url;
  } else if (action === 'delete') {
    payload.code = (body.code || '').trim(); payload.secret = SECRET;
    if (!payload.code) return res.status(400).json({ ok:false, message:"Missing code to delete" });
  } else if (action === 'update') {
    payload.code = (body.code || '').trim(); payload.url = (body.url || '').trim(); payload.secret = SECRET;
    if (!payload.code || !payload.url) return res.status(400).json({ ok:false, message:"Missing code or url" });
  } else if (action === 'list') {
    payload.secret = SECRET;
  }

  try {
    const r = await fetch(GS, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    let json;
    try { json = JSON.parse(text) } catch (e) { json = { ok:false, message: text } }
    if (json.ok) return res.status(200).json(json);
    else return res.status(400).json(json);
  } catch (err) {
    return res.status(500).json({ ok:false, message: err.message });
  }
}
