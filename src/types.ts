export interface RepoConfig {
  id: string
  desc?: string
  tags?: string[]
}

export interface Category {
  name: string
  slug: string
  repos: RepoConfig[]
}

export interface NavConfig {
  pinned: RepoConfig[]
  categories: Category[]
}

export interface GithubRepo {
  id: string
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface RepoCard extends RepoConfig {
  github?: GithubRepo
  loading: boolean
  error: boolean
}

export type ViewMode = 'grid' | 'list'
export type SortMode = 'default' | 'stars' | 'name'
