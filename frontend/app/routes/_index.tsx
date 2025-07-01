import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { SnippetForm } from "~/components/SnippetForm";
import { SnippetList } from "~/components/SnippetList";

export const meta: MetaFunction = () => {
  return [{ title: "AI Snippet Summarizer" }];
};

export async function loader({}: LoaderFunctionArgs) {
  const res = await fetch("http://localhost:3000/snippets");
  const snippets = await res.json();
  return json({ snippets });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text");

  const res = await fetch("http://localhost:3000/snippets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer hardcoded-token-if-needed`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  return json(data);
}

export default function Index() {
  const { snippets } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";


  return (
    <main className="bg-emerald-50 min-h-screen p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-100 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-emerald-900 text-center">
          AI Snippet Summarizer
        </h1>

        <SnippetForm isSubmitting={isSubmitting} />

        <hr className="my-8 border-t border-slate-100" />
        <h2 className="text-2xl font-semibold mb-4 text-emerald-800">Previous Snippets</h2>

        <SnippetList snippets={snippets} />
      </div>
  </main>
  );
}
