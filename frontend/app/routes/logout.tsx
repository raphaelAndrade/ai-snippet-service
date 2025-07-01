import { redirect } from "@remix-run/node";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}

export async function loader() {
  return redirect("/login");
}
