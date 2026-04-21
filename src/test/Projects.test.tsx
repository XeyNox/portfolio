import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Projects from '../components/Projects'
import { projects } from '../data/portfolio'

function renderProjects() {
  return render(<MemoryRouter><Projects /></MemoryRouter>)
}

describe('Projects', () => {
  it('renders all projects', () => {
    renderProjects()
    const cards = screen.getAllByTestId('project-card')
    expect(cards).toHaveLength(projects.length)
  })

  it('renders project titles', () => {
    renderProjects()
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument()
    })
  })

  it('renders project tags', () => {
    renderProjects()
    const firstProject = projects[0]
    firstProject.tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    })
  })

  it('renders github links for projects that have one', () => {
    renderProjects()
    const githubLinks = screen.getAllByRole('link', { name: /code source/i })
    const projectsWithGithub = projects.filter((p) => p.githubUrl)
    expect(githubLinks).toHaveLength(projectsWithGithub.length)
  })

  it('renders live links for projects that have one', () => {
    renderProjects()
    const liveLinks = screen.getAllByRole('link', { name: /démo live/i })
    const projectsWithLive = projects.filter((p) => p.liveUrl)
    expect(liveLinks).toHaveLength(projectsWithLive.length)
  })

  it('renders internal presentation link for projects that have one', () => {
    renderProjects()
    const presentationLinks = screen.getAllByRole('link', { name: /présentation/i })
    const projectsWithInternal = projects.filter((p) => p.internalUrl)
    expect(presentationLinks).toHaveLength(projectsWithInternal.length)
  })
})
