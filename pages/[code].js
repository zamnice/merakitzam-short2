import { useEffect, useState } from "react";

export default function Preview({ code }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GS_SCRIPT_URL}?code=${code}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.ok) setData(d.data);
      });
  }, [code]);

  if (!data) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg text-center animate-fadeIn">
        <h1 className="text-2xl font-bold text-orange-500">{data.title || "Untitled"}</h1>
        <p className="text-gray-600 mb-4">{data.desc}</p>
        <p className="text-blue-600 underline">{data.url}</p>
        <a
          href={data.url}
          className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Go to Link
        </a>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { code: params.code } };
}
