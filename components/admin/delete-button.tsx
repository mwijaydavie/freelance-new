"use client"

import { Trash2 } from "lucide-react"

import { deleteProduct } from "@/app/admin/actions"

export function DeleteButton({ slug, name }: { slug: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${name}” from the catalogue? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-red-400/25 px-3.5 py-2 text-[12px] text-red-300/80 transition-colors hover:border-red-400/60 hover:text-red-200"
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>
    </form>
  )
}
