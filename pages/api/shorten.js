export default async function handler(req, res) {
  const data = JSON.parse(req.body);
  const r = await fetch(process.env.GS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await r.json();
  res.status(200).json(json);
}
