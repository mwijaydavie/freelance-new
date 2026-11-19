import { isAdmin, isAdminEnabled } from "@/lib/auth"
import { readSubscribers } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isAdminEnabled()) {
    return new Response("Not found", { status: 404 })
  }

  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 })
  }

  const subscribers = await readSubscribers()
  const rows = [
    ["email", "source", "joined"],
    ...subscribers.map((s) => [s.email, s.source, s.at]),
  ]
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="genie-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
