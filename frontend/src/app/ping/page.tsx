import { apiGet } from "@/lib/api";

type Ping = { message: string; app: string; time: string };

export default async function Home() {
  const data = await apiGet<Ping>("/ping");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">BLC Surabaya</h1>
      <pre className="mt-4 rounded bg-gray-100 p-4 text-sm text-black">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}