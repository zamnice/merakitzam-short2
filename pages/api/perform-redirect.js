// pages/api/perform-redirect.js
export default async function handler(req, res) {
  const GS = process.env.GS_SCRIPT_URL;
  if (!GS) return res.status(500).send("GS_SCRIPT_URL not set");
  const code = req.query.code || '';
  if (!code) return res.status(400).send("Missing code");

  try {
    const r = await fetch(`${GS}?code=${encodeURIComponent(code)}&action=fetch`, { method: 'GET' });
    const json = await r.json();
    if (json && json.ok && json.url) {
      res.writeHead(307, { Location: json.url });
      return res.end();
    } else {
      return res.status(404).send("Link not found");
    }
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
}
