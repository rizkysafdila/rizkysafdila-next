"use server"

import { createClient } from "@/utils/supabase/server"

interface IProjectQuery {
  is_featured: boolean
}

export async function fetchProjects(q?: IProjectQuery) {
  const supabase = await createClient()
  
  let query = supabase
    .from('projects')
    .select(`id, title, subtitle, tech_stacks, thumbnail_url, is_featured`)
    .order('is_featured', { ascending: false })

  if (typeof q?.is_featured === 'boolean') {
    query = query.eq('is_featured', q.is_featured)
  }

  const { data, error } = await query

  const projects = data?.map(project => ({
    ...project,
    tech_stacks: JSON.parse(project?.tech_stacks),
  })) 

  return { projects, error }
}