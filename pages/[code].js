// pages/[code].js
export async function getServerSideProps(ctx) {
  const code = ctx.params.code;
  // call our server-side meta API to keep GS_URL secret
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`;
  // We can call internal API route using absolute path via fetch to Vercel (use internal request)
  // Instead, call Apps Script directly from server side to avoid extra hop:
  const GS = process.env.GS_SCRIPT_URL;
  if (!GS) return { notFound: true };

  try {
    const r = await fetch(`${GS}?code=${encodeURIComponent(code)}&action=meta`);
    const j = await r.json();
    if (!j.ok) return { props: { notFound: true } };
    return { props: { data: j.data } };
  } catch (err) {
    return { props: { error: err.message } };
  }
}

export default function Preview({ data, notFound, error }) {
  if (notFound) return <div className="min-h-screen flex items-center justify-center"><h1>Link tidak ditemukan</h1></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><h1>Error: {error}</h1></div>

  // data: { code, url, createdAt, clicks }
  const redirectPath = `/api/perform-redirect?code=${encodeURIComponent(data.code)}`

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold" style={{color:"#FF6B00"}}>Preview — {data.code}</h1>
        <p className="mt-3 text-sm text-gray-600">Kamu akan diarahkan ke:</p>

        <div className="mt-4 p-4 border rounded-md">
          <p className="font-mono break-all">{data.url}</p>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div>
            <button id="goBtn" className="py-2 px-4 rounded text-white" style={{background:"#FF6B00"}} onClick={() => location.href=redirectPath}>Pergi Sekarang</button>
          </div>
          <div className="text-sm text-gray-500">Atau tunggu <span id="count">3</span> detik untuk auto-redirect.</div>
        </div>

        <div className="mt-4 text-xs text-gray-500">Clicks: {data.clicks} • Created: {data.createdAt}</div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
        (function(){
          var t = 3;
          var el = document.getElementById('count');
          var iv = setInterval(function(){
            t--; if (t<=0) { clearInterval(iv); window.location.href='${redirectPath}'; }
            else el.innerText = t;
          }, 1000);
        })();
        `
      }} />
    </div>
  )
  }
