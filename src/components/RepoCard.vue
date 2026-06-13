<template>
  <a
    :href="card.github?.html_url || `https://github.com/${card.id}`"
    target="_blank"
    rel="noopener noreferrer"
    class="repo-card"
    :class="{ 'is-loading': card.loading, 'is-list': listMode }"
  >
    <!-- Skeleton -->
    <template v-if="card.loading">
      <div class="skeleton-header">
        <div class="skeleton avatar-sk"></div>
        <div class="skeleton name-sk"></div>
      </div>
      <div class="skeleton desc-sk"></div>
      <div class="skeleton desc-sk short"></div>
      <div class="skeleton-footer">
        <div class="skeleton tag-sk"></div>
        <div class="skeleton tag-sk"></div>
      </div>
    </template>

    <!-- Loaded -->
    <template v-else-if="card.github">
      <div class="card-header">
        <img :src="card.github.owner.avatar_url" :alt="card.github.owner.login" class="owner-avatar" loading="lazy" />
        <div class="card-title">
          <span class="owner">{{ card.github.owner.login }}</span>
          <span class="sep">/</span>
          <span class="repo-name">{{ card.github.name }}</span>
        </div>
        <span v-if="card.github.language" class="lang-badge">{{ card.github.language }}</span>
      </div>

      <p class="card-desc">{{ card.github.description || card.desc || 'No description.' }}</p>

      <div class="card-footer">
        <div class="stats">
          <span class="stat">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
            </svg>
            {{ formatNum(card.github.stargazers_count) }}
          </span>
          <span class="stat">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
            </svg>
            {{ formatNum(card.github.forks_count) }}
          </span>
        </div>
        <div class="tags">
          <span v-for="tag in displayTags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </template>

    <!-- Fallback (API unavailable / rate limited): render from YAML config -->
    <template v-else>
      <div class="card-header">
        <div class="fallback-avatar">{{ ownerInitial }}</div>
        <div class="card-title">
          <span class="owner">{{ ownerName }}</span>
          <span class="sep">/</span>
          <span class="repo-name">{{ repoName }}</span>
        </div>
      </div>

      <p class="card-desc">{{ card.desc || 'No description.' }}</p>

      <div class="card-footer">
        <div class="tags">
          <span v-for="tag in (card.tags || []).slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </template>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RepoCard } from '../types'

const props = defineProps<{
  card: RepoCard
  listMode?: boolean
}>()

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

const displayTags = computed(() => {
  const gh = props.card.github
  const topics = gh?.topics?.slice(0, 3) || []
  const configured = props.card.tags?.slice(0, 3) || []
  const merged = [...new Set([...topics, ...configured])]
  return merged.slice(0, 3)
})

const ownerName = computed(() => props.card.id.split('/')[0] || props.card.id)
const repoName = computed(() => props.card.id.split('/')[1] || props.card.id)
const ownerInitial = computed(() => (ownerName.value[0] || '?').toUpperCase())
</script>

<style scoped>
.repo-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  min-height: 140px;
}
.repo-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow);
}
.is-list {
  flex-direction: row;
  align-items: center;
  min-height: auto;
  gap: 16px;
}
.is-list .card-desc { flex: 1; margin: 0; -webkit-line-clamp: 1; }
.is-list .card-footer { margin-top: 0; }

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.owner-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid var(--border);
}
.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.owner { color: var(--text-muted); }
.sep { color: var(--border); margin: 0 2px; }
.repo-name { color: var(--accent); }
.lang-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--tag-bg);
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}
.card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 8px;
}
.stats { display: flex; gap: 12px; }
.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.tags { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.tag {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--tag-bg);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--sk-from) 25%, var(--sk-to) 50%, var(--sk-from) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 4px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-header { display: flex; align-items: center; gap: 10px; }
.avatar-sk { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
.name-sk { width: 140px; height: 14px; }
.desc-sk { width: 100%; height: 12px; }
.desc-sk.short { width: 65%; }
.skeleton-footer { display: flex; gap: 8px; margin-top: auto; }
.tag-sk { width: 50px; height: 20px; border-radius: 4px; }

.fallback-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--tag-bg);
  color: var(--text-muted);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  flex-shrink: 0;
}
</style>
