import type { MetaFunction } from "@remix-run/node";
import { SnippetForm } from "~/components/SnippetForm";
import { SnippetList } from "~/components/SnippetList";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const snippets = [
  {
    id: "1",
    text: "text 1",
    summary: "summary 1",
  },
  {
    id: "2",
    text: "text 2",
    summary: "summary 2",
  }
]

export default function Index() {
  return (
    <main className="bg-emerald-50 min-h-screen p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-100 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-emerald-900 text-center">
          AI Snippet Summarizer
        </h1>

        <SnippetForm />

        <hr className="my-8 border-t border-slate-100" />
        <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Previous Snippets</h2>

        <SnippetList snippets={snippets} />
      </div>
  </main>
  );
}
