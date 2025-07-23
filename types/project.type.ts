export interface IProjectDetail {
  id: string
  title: string
  subtitle: string
  description: string
  thumbnail_url: string
  start_date: string
  end_date: string
  tech_stacks: string[]
  source_code: string
  demo_url: string
  created_at: string
  project_images: IProjectImage[] | string[]
  is_featured: boolean
}

export type TProject = Pick<IProjectDetail, 'id' | 'title' | 'subtitle' | 'tech_stacks' | 'thumbnail_url' | 'is_featured'>

export interface IProjectImage {
  id: string
  project_id: string
  image_url: string
  created_at: string
}