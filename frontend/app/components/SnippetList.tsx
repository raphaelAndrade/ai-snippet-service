import { Snippet } from "~/types/snippet";
import { SnippetCard } from "./SnippetCard";

interface SnippetListProps {
  snippets: Snippet[];
}

export function SnippetList({ snippets }: SnippetListProps) {
  if (!snippets || snippets.length === 0) return null;

  return (
    <ul
      className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
      aria-label="List of summarized snippets"
    >
      {[...snippets].reverse().map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </ul>
  );
}
