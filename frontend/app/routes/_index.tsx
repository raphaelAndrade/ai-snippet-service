import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Snippet } from "~/types/snippet";
import { SnippetForm } from "~/components/SnippetForm";
import { SnippetList } from "~/components/SnippetList";
import { StreamingSummary } from "~/components/StreamingSummary";
import { useAuth } from "~/context/AuthContext";

export const meta: MetaFunction = () => {
  return [{ title: "AI Snippet Summarizer" }];
};

function extractTokenFromCookie(request: Request): string | null {
  const cookie = request.headers.get("Cookie");
  return cookie?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1] ?? null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = extractTokenFromCookie(request);
  if (!token) return;

  const response = await fetch("http://localhost:3000/snippets", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch snippets");

  const data = await response.json();
  return json(data as Snippet[]);
}

export default function Index() {
  const { token } = useAuth();
  const snippets = useLoaderData<Snippet[]>();
  const [summary, setSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleSubmit(text: string) {
    setIsStreaming(true);
    setSummary("");

    try {
      const fullSummary = await streamSummary(text);
      await saveSnippet(text, fullSummary);
      window.location.reload();
    } catch (err) {
      console.error("Error during summarization:", err);
    } finally {
      setIsStreaming(false);
    }
  }

async function streamSummary(text: string): Promise<string> {
  const response = await fetch(
    `http://localhost:3000/snippets/stream?text=${encodeURIComponent(text)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.body) {
    throw new Error("No stream body found");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";
  let finalText = "";

  try {
    for await (const chunk of readStream(reader)) {
      buffer += decoder.decode(chunk, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        if (part.startsWith("data: ")) {
          try {
            const payload = JSON.parse(part.slice(6)); // remove "data: "
            if (payload.chunk) {
              finalText += payload.chunk;
              setSummary((prev) => prev + payload.chunk);
            }
          } catch (err) {
            console.warn("Failed to parse chunk:", part);
          }
        }
      }
    }
  } finally {
    reader.releaseLock(); // clean release
  }

  return finalText;
}

async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) yield value;
  }
}


  async function saveSnippet(text: string, summary: string) {
    const res = await fetch("http://localhost:3000/snippets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, summary }),
    });

    if (!res.ok) {
      throw new Error("Failed to save snippet");
    }
  }

  return (
    <>
      <main className="bg-emerald-50 min-h-screen p-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 p-8 rounded-xl shadow">
          <h1 className="text-3xl font-bold mb-6 text-emerald-900 text-center">
            AI Snippet Summarizer
          </h1>

          <SnippetForm onSubmitText={handleSubmit} />
          <StreamingSummary summary={summary} isStreaming={isStreaming} />

          <hr className="my-8 border-t border-slate-100" />
          <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Previous Snippets</h2>

          {snippets.length === 0 ? (
            <p className="text-center text-slate-500 pt-8">
              You haven&apos;t created any snippets yet. Get started above!
            </p>
          ) : (
            <SnippetList snippets={snippets} />
          )}
        </div>
      </main>
    </>
  );
}
