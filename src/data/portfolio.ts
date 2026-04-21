export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  internalUrl?: string
  playUrl?: string
}

export interface Skill {
  category: string
  items: string[]
}

export const projects: Project[] = [
  {
    id: 'oral',
    title: 'Oral de fin d\'année',
    description: 'Présentation orale du projet réalisé en alternance pour le titre RNCP Développeur Full Stack.',
    tags: ['Alternance', 'RNCP', 'Full Stack', 'Présentation'],
    internalUrl: '/oral',
  },
  {
    id: 'game',
    title: 'Nom du jeu',
    description: 'Description du jeu — genre, mécaniques, ce qui le rend intéressant.',
    tags: ['Python', 'Pygame', 'Game Dev'],
    githubUrl: 'https://github.com/raphtalia/nom-du-repo',
    playUrl: 'https://raphtalia.github.io/nom-du-repo',
  },
  {
    id: '1',
    title: 'Projet exemple',
    description: 'Une application web full-stack avec authentification, base de données et déploiement CI/CD.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    id: '2',
    title: 'API REST',
    description: "Une API performante avec documentation OpenAPI, tests d'intégration et monitoring.",
    tags: ['Node.js', 'Express', 'Docker', 'OpenAPI'],
    githubUrl: 'https://github.com',
  },
  {
    id: '3',
    title: 'Dashboard analytics',
    description: 'Interface de visualisation de données en temps réel avec graphiques interactifs.',
    tags: ['React', 'D3.js', 'WebSocket', 'TailwindCSS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {               
    id: 'game',
    title: 'Mielus Belly',
    description: '...',
    tags: ['Python', 'Pygame', 'Game Dev'],           
    githubUrl: 'https://github.com/XeyNox/Mielus',
    playUrl:                                          
  'https://xeynox.github.io/Mielus/',
  },              
]

export const skills: Skill[] = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'TailwindCSS', 'Next.js'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'GitHub Actions', 'Vercel', 'Linux'],
  },
]
