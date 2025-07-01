import {
    Form,
    useActionData,
    useNavigation,
    useNavigate,
  } from "@remix-run/react";
  import { ActionFunctionArgs, json } from "@remix-run/node";
  import { useEffect } from "react";
  import { useAuth } from "~/context/AuthContext";
  import { User } from "~/types/user";
  
  type ActionData =
    | { error: string }
    | { user: User; token: string };
  
  export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
  
    if (typeof email !== "string" || typeof password !== "string") {
      return json({ error: "Both fields are required." }, { status: 400 });
    }
  
    try {
      const res = await fetch(`${process.env.API_URL ?? "http://localhost:3000"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: password }),
      });
  
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Invalid credentials" }));
        return json({ error: message || "Invalid credentials" }, { status: 401 });
      }
  
      const { token } = await res.json();
      return json(
        { user: { email }, token },
        {
          headers: {
            "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
          },
        }
      );
    } catch (err) {
      console.error("Login error:", err);
      return json({ error: "Server error. Please try again." }, { status: 500 });
    }
  }
  
  export default function LoginPage() {
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const navigate = useNavigate();
    const { login } = useAuth();
  
    useEffect(() => {
      if (actionData && "user" in actionData) {
        login(actionData.user, actionData.token);
        navigate("/");
      }
    }, [actionData, login, navigate]);
  
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-emerald-50 p-8">
        <div className="bg-white p-8 border border-slate-100 rounded-xl shadow max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-emerald-800 text-center">Login</h1>
  
          <Form method="post" className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full border border-slate-200 px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border border-slate-200 px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
  
            {actionData && "error" in actionData && (
              <p className="text-red-500 text-center">{actionData.error}</p>
            )}
  
            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className="w-full bg-emerald-700 text-white py-2 rounded font-semibold hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {navigation.state === "submitting" ? "Logging in..." : "Login"}
            </button>
          </Form>
        </div>
      </main>
    );
  }
  