"use server"

import { IProfile } from "@/types/profile.type"
import { createClient } from "@/utils/supabase/server"

export async function fetchProfile() {
  const supabase = await createClient()

  let { data, error } = await supabase
    .from("profiles")
    .select(`id, name, jobTitle:title, summary:description, photo:profile_image, is_available, is_verified`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single<IProfile>()

  const profile = data

  return { profile, error }
}
