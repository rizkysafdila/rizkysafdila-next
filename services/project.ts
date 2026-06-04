"use server"

import { createClient } from "@/utils/supabase/server"
import { IProjectDetail } from "@/types/project.type"

interface IProjectQuery {
  is_featured: boolean
}

export async function fetchProjects(q?: IProjectQuery) {
  const supabase = await createClient()
  
  let query = supabase
    .from('projects')
    .select(`id, title, subtitle, tech_stacks, thumbnail_url, is_featured`)
    .order('is_featured', { ascending: false })
    .order('order', { ascending: true })

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

export async function fetchProjectById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, title, subtitle, description, thumbnail_url,
      start_date, end_date, tech_stacks, source_code, demo_url,
      created_at, is_featured,
      project_images(id, project_id, image_url, created_at)
    `)
    .eq('id', id)
    .single()

  const project: IProjectDetail | null = data
    ? { ...data, tech_stacks: JSON.parse(data.tech_stacks) }
    : null

  return { project, error }
}