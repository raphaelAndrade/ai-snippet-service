import { Form } from "@remix-run/react";
import { useState } from "react";

interface SnippetFormProps {
    isSubmitting: boolean
}

export function SnippetForm({ isSubmitting }: SnippetFormProps) {
    const [text, setText] = useState("");
    
  return (
    <Form method="post" className="space-y-4" aria-label="Generate summary form">
      <div className="space-y-2">
        <label htmlFor="text" className="block text-sm font-medium text-slate-700">
          Your text to summarize
        </label>
        <textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Paste or write your text here..."
          required
          className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 p-4 rounded-lg shadow-sm resize-none placeholder-slate-400 transition outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 rounded-lg font-medium transition bg-emerald-700 text-white hover:bg-emerald-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Summarizing..." : "Generate Summary"}
      </button>
    </Form>
  );
}
