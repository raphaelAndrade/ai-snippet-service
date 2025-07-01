import { useState } from "react";

interface SnippetFormProps {
  onSubmitText: (text: string) => void;
}

export function SnippetForm({ onSubmitText }: SnippetFormProps) {
  const [text, setText] = useState("");

  const isEmpty = text.trim().length === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;

    onSubmitText(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Generate summary form">
      <div className="space-y-2">
        <label htmlFor="text" className="block text-sm font-medium text-slate-700">
          Your text to summarize
        </label>
        <textarea
          id="text"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Paste or write your text here..."
          required
          className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 p-4 rounded-lg shadow-sm resize-none placeholder-slate-400 transition outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isEmpty}
        className={`w-full px-4 py-2 rounded-lg font-medium transition ${
          isEmpty
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-emerald-700 text-white hover:bg-emerald-800"
        }`}
      >
        Generate Summary
      </button>
    </form>
  );
}
