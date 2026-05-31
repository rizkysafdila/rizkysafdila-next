"use server"

import { CareerEntry } from "@/types/career.type"
import { createClient } from "@/utils/supabase/server"

export async function fetchCareers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("careers")
    .select(
      `id, company, role, start_date, end_date, current, type, location, description, technologies, created_at`
    )
    .order("current", { ascending: false })
    .order("start_date", { ascending: false })

  const entries = data as CareerEntry[] | null

  return { entries, error }
}
