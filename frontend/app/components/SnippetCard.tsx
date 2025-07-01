import { Snippet } from "~/types/snippet";
import { Link } from "@remix-run/react";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <li className="transition hover:shadow-md border border-slate-100 rounded-xl shadow-sm overflow-hidden">
      <Link
        to={`/snippets/${snippet.id}`}
        aria-label={`View full snippet ${snippet.id}`}
        className="block p-6 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Summary</h3>
            <p className="text-slate-900 leading-relaxed">{snippet.summary}</p>
          </section>

          <section>
            <h4 className="text-sm font-medium text-slate-700 uppercase tracking-wide">Original Text</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap mt-1">
              {snippet.text}
            </p>
          </section>
        </div>
      </Link>
    </li>
  );
}
