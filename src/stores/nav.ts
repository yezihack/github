import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jsyaml from 'js-yaml'
import type { NavConfig, Category, RepoCard, GithubRepo, ViewMode, SortMode } from '../types'

const CACHE_TTL = 1000 * 60 * 30 // 30 min
const GITHUB_CACHE_KEY = 'gh_nav_cache_v1'

function loadCache(): Record<string, { data: GithubRepo; ts: number }> {
  try {
    return JSON.parse(localStorage.getItem(GITHUB_CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}
function saveCache(cache: Record<string, { data: GithubRepo; ts: number }>) {
  try {
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

export const useNavStore = defineStore('nav', () => {
  const config = ref<NavConfig | null>(null)
  const pinnedCards = ref<RepoCard[]>([])
  const categories = ref<Category[]>([])
  const repoMap = ref<Map<string, RepoCard>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const viewMode = ref<ViewMode>('grid')
  const sortMode = ref<SortMode>('default')
  const activeCategory = ref<string>('all')
  const rateLimited = ref(false)

  const cache = loadCache()

  // null: not found / network error; 'rate-limited': hit GitHub rate limit
  async function fetchGithubRepo(id: string): Promise<GithubRepo | null | 'rate-limited'> {
    const now = Date.now()
    const cached = cache[id]
    if (cached && now - cached.ts < CACHE_TTL) return cached.data

    try {
      const res = await fetch(`https://api.github.com/repos/${id}`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      })
      // 403/429 with exhausted quota => rate limited
      if (res.status === 403 || res.status === 429) {
        if (res.headers.get('x-ratelimit-remaining') === '0' || res.status === 429) {
          return 'rate-limited'
        }
        return null
      }
      if (!res.ok) return null
      const data: GithubRepo = await res.json()
      cache[id] = { data, ts: now }
      saveCache(cache)
      return data
    } catch {
      return null
    }
  }

  async function loadConfig() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}repos.yaml`)
      const text = await res.text()
      const parsed = jsyaml.load(text) as NavConfig
      config.value = parsed

      // Init pinned
      pinnedCards.value = (parsed.pinned || []).map(r => ({
        ...r,
        loading: true,
        error: false
      }))

      // Init categories
      categories.value = parsed.categories || []

      // Build repo map
      const allRepos: RepoCard[] = [
        ...pinnedCards.value,
        ...parsed.categories.flatMap(c =>
          c.repos.map(r => ({ ...r, loading: true, error: false }))
        )
      ]

      const seen = new Set<string>()
      for (const card of allRepos) {
        if (!seen.has(card.id)) {
          seen.add(card.id)
          repoMap.value.set(card.id, card)
        }
      }

      // Fetch GitHub data in batches
      loading.value = false
      const ids = [...seen]
      const BATCH = 6
      let stopped = false
      for (let i = 0; i < ids.length && !stopped; i += BATCH) {
        const batch = ids.slice(i, i + BATCH)
        await Promise.all(
          batch.map(async id => {
            const card = repoMap.value.get(id)!
            const gh = await fetchGithubRepo(id)
            if (gh === 'rate-limited') {
              // Stop hammering the API; leave card to fall back to YAML config
              rateLimited.value = true
              stopped = true
              card.loading = false
            } else if (gh) {
              card.github = gh
              card.loading = false
            } else {
              card.error = true
              card.loading = false
            }
          })
        )
      }

      // Any cards still pending (skipped due to rate limit) stop loading,
      // they will render from the YAML-configured fallback data.
      if (stopped) {
        for (const card of repoMap.value.values()) {
          if (card.loading) card.loading = false
        }
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load config'
      loading.value = false
    }
  }

  function getCard(id: string): RepoCard | undefined {
    return repoMap.value.get(id)
  }

  const filteredCategories = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return categories.value
      .filter(cat => activeCategory.value === 'all' || cat.slug === activeCategory.value)
      .map(cat => ({
        ...cat,
        repos: cat.repos
          .map(r => repoMap.value.get(r.id) || { ...r, loading: true, error: false })
          .filter(card => {
            if (!q) return true
            const gh = card.github
            const name = card.id.toLowerCase()
            const desc = (gh?.description || card.desc || '').toLowerCase()
            const tags = (card.tags || []).join(' ').toLowerCase()
            return name.includes(q) || desc.includes(q) || tags.includes(q)
          })
          .sort((a, b) => {
            if (sortMode.value === 'stars') {
              return (b.github?.stargazers_count || 0) - (a.github?.stargazers_count || 0)
            }
            if (sortMode.value === 'name') {
              return a.id.localeCompare(b.id)
            }
            return 0
          })
      }))
      .filter(cat => cat.repos.length > 0)
  })

  return {
    config, pinnedCards, categories, repoMap, loading, error, rateLimited,
    searchQuery, viewMode, sortMode, activeCategory,
    loadConfig, getCard, filteredCategories
  }
})
