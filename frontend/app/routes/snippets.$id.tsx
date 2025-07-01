import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Snippet } from "~/types/snippet";

function getTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  return cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1] || null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Response("Snippet ID not provided", { status: 400 });

  const token = getTokenFromCookies(request);
  if (!token) return redirect("/login");

  const res = await fetch(`http://backend:3000/snippets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 403) throw new Response("Access denied", { status: 403 });
  if (!res.ok) throw new Response("Snippet not found", { status: 404 });

  return json(await res.json() as Snippet);
}

export default function SnippetDetail() {
  const snippet = useLoaderData<Snippet>();

  return (
    <main className="bg-emerald-50 min-h-screen p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-block text-emerald-700 hover:underline text-sm"
        >
          ← Back to Home
        </Link>

        <div className="bg-white border border-slate-100 p-8 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">Snippet Detail</h1>

          <section aria-labelledby="summary-title" className="mb-6">
            <h2 id="summary-title" className="text-lg font-semibold text-slate-800 mb-1">
              Summary
            </h2>
            <p className="text-slate-700 whitespace-pre-wrap">{snippet.summary}</p>
          </section>

          <section aria-labelledby="original-title">
            <h2 id="original-title" className="text-lg font-semibold text-slate-800 mb-1">
              Original Text
            </h2>
            <p className="text-slate-700 text-sm whitespace-pre-wrap">{snippet.text}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
