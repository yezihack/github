<template>
  <section class="pinned-bar">
    <div class="pinned-label">
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.081 3.081 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 9.695l.47 3.15a1.75 1.75 0 0 1-2.62 1.716L6.44 13.17l-2.47 1.39a1.75 1.75 0 0 1-2.62-1.718l.47-3.147-2.206-2.2c-.968-.968-.5-2.623.832-2.94l2.454-.584A3.081 3.081 0 0 0 4.984 2.06Z"/>
      </svg>
      Pinned
    </div>
    <div class="pinned-list">
      <a
        v-for="card in store.pinnedCards"
        :key="card.id"
        :href="card.github?.html_url || `https://github.com/${card.id}`"
        target="_blank"
        rel="noopener noreferrer"
        class="pinned-chip"
        :class="{ loading: card.loading }"
      >
        <template v-if="!card.loading && card.github">
          <img :src="card.github.owner.avatar_url" :alt="card.github.owner.login" class="chip-avatar" />
          <span class="chip-name">{{ card.github.name }}</span>
          <span class="chip-stars">
            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
            </svg>
            {{ formatNum(card.github.stargazers_count) }}
          </span>
        </template>
        <template v-else-if="card.loading">
          <div class="chip-sk skeleton"></div>
        </template>
        <template v-else>
          <span class="chip-name error">{{ card.id.split('/')[1] }}</span>
        </template>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useNavStore } from '../stores/nav'

const store = useNavStore()

function formatNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<style scoped>
.pinned-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  flex-wrap: wrap;
}
.pinned-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  white-space: nowrap;
  flex-shrink: 0;
}
.pinned-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pinned-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--card-bg);
  text-decoration: none;
  color: var(--text);
  font-size: 0.78rem;
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
}
.pinned-chip:hover {
  border-color: var(--accent);
  background: var(--hover-bg);
}
.chip-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.chip-name { font-weight: 600; }
.chip-name.error { color: var(--error); }
.chip-stars {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--text-muted);
  font-size: 0.72rem;
}
.chip-sk {
  width: 80px;
  height: 12px;
  border-radius: 4px;
}
.skeleton {
  background: linear-gradient(90deg, var(--sk-from) 25%, var(--sk-to) 50%, var(--sk-from) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
