"use client"

import * as React from "react"
import { IProjectDetail } from "@/types/project.type"
import { fetchProjectById } from "@/services/project"
import { ProjectDetailModal } from "@/components/project/project-detail-modal"

interface ProjectModalContextValue {
  open: (id: string) => void
}

const ProjectModalContext =
  React.createContext<ProjectModalContextValue | null>(null)

export function useProjectModal() {
  const context = React.useContext(ProjectModalContext)

  if (!context) {
    throw new Error("useProjectModal must be used within a <ProjectModalProvider />")
  }

  return context
}

export function ProjectModalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [project, setProject] = React.useState<IProjectDetail | null>(null)

  const open = React.useCallback(async (id: string) => {
    setIsOpen(true)
    setLoading(true)
    setError(false)
    setProject(null)

    const { project, error } = await fetchProjectById(id)

    if (error || !project) {
      setError(true)
    } else {
      setProject(project)
    }
    setLoading(false)
  }, [])

  return (
    <ProjectModalContext.Provider value={{ open }}>
      {children}
      <ProjectDetailModal
        open={isOpen}
        onOpenChange={setIsOpen}
        loading={loading}
        error={error}
        project={project}
      />
    </ProjectModalContext.Provider>
  )
}
