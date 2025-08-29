import Swal from "sweetalert2";

export default function Home() {
  async function handleSubmit(e) {
    e.preventDefault();
    const code = e.target.code.value;
    const url = e.target.url.value;
    const title = e.target.title.value;
    const desc = e.target.desc.value;

    const res = await fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({ code, url, title, desc }),
    });
    const data = await res.json();

    if (data.ok) {
      Swal.fire("Success", `Short link created: /${code}`, "success");
    } else {
      Swal.fire("Error", data.message, "error");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-96 space-y-4 animate-fadeIn"
      >
        <h1 className="text-2xl font-bold text-orange-500">MerakitZAM Shortener</h1>
        <input name="code" placeholder="Custom code" className="w-full border p-2 rounded" />
        <input name="url" placeholder="Long URL" className="w-full border p-2 rounded" />
        <input name="title" placeholder="Title" className="w-full border p-2 rounded" />
        <textarea name="desc" placeholder="Description" className="w-full border p-2 rounded" />
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full">
          Create Short Link
        </button>
      </form>
    </div>
  );
}
