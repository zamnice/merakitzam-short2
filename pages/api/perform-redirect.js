// pages/api/perform-redirect.js
export default async function handler(req, res) {
  const GS = process.env.GS_SCRIPT_URL;
  if (!GS) return res.status(500).send("GS_SCRIPT_URL not set");
  const code = req.query.code || '';
  if (!code) return res.status(400).send("Missing code");
  try {
    const r = await fetch(`${GS}?code=${encodeURIComponent(code)}&action=redirect`, { method:'GET' });
    const html = await r.text();
    // forward the HTML content (meta refresh) to client
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
}
