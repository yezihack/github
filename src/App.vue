<template>
  <div class="app" :class="{ dark: isDark }">
    <!-- Header -->
    <header class="site-header">
      <div class="header-inner">
        <div class="brand">
          <svg class="gh-icon" viewBox="0 0 16 16" width="28" height="28" fill="currentColor" aria-hidden="true">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/>
          </svg>
          <div>
            <h1 class="site-title">GitHub Stars</h1>
            <p class="site-sub">Curated top repositories</p>
          </div>
        </div>

        <div class="header-controls">
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
            </svg>
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="Search repos…"
              class="search-input"
            />
            <button v-if="store.searchQuery" class="clear-btn" @click="store.searchQuery = ''">×</button>
          </div>

          <div class="toolbar">
            <select v-model="store.sortMode" class="sort-select">
              <option value="default">Default</option>
              <option value="stars">Most Stars</option>
              <option value="name">A–Z</option>
            </select>

            <div class="view-toggle">
              <button :class="{ active: store.viewMode === 'grid' }" @click="store.viewMode = 'grid'" title="Grid">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5Zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5Zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5Zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5Z"/>
                </svg>
              </button>
              <button :class="{ active: store.viewMode === 'list' }" @click="store.viewMode = 'list'" title="List">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
              </button>
            </div>

            <button class="theme-btn" @click="toggleDark" :title="isDark ? 'Light mode' : 'Dark mode'">
              <svg v-if="isDark" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 .75a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 .75Zm0 12a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 8 12.75ZM2.164 2.164a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 0 1-1.06 1.061l-.708-.707a.75.75 0 0 1 0-1.06Zm9.9 9.9a.75.75 0 0 1 1.06 0l.707.707a.75.75 0 0 1-1.06 1.06l-.707-.707a.75.75 0 0 1 0-1.06ZM.75 8a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 .75 8Zm12 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM2.164 13.836a.75.75 0 0 1 0-1.06l.708-.708a.75.75 0 1 1 1.06 1.06l-.707.708a.75.75 0 0 1-1.061 0Zm9.9-9.9a.75.75 0 0 1 0-1.06l.707-.708a.75.75 0 1 1 1.061 1.061l-.708.707a.75.75 0 0 1-1.06 0Z"/>
              </svg>
              <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <div v-if="store.loading" class="global-loading">
          <div class="spinner"></div>
          <span>Loading repositories…</span>
        </div>

        <div v-else-if="store.error" class="global-error">
          <p>⚠ {{ store.error }}</p>
          <button @click="store.loadConfig()">Retry</button>
        </div>

        <template v-else>
          <div v-if="store.rateLimited" class="rate-notice">
            <span>⚠ 已触发 GitHub API 速率限制（未登录每小时 60 次）。当前展示的是配置文件中的本地信息，star / fork 等实时数据稍后会自动恢复。</span>
          </div>

          <PinnedBar />

          <div class="layout">
            <nav class="sidebar">
              <button
                class="cat-btn"
                :class="{ active: store.activeCategory === 'all' }"
                @click="store.activeCategory = 'all'"
              >All</button>
              <button
                v-for="cat in store.categories"
                :key="cat.slug"
                class="cat-btn"
                :class="{ active: store.activeCategory === cat.slug }"
                @click="store.activeCategory = cat.slug"
              >{{ cat.name }}</button>
            </nav>

            <div class="content">
              <div v-if="store.filteredCategories.length === 0" class="empty-state">
                <svg viewBox="0 0 16 16" width="40" height="40" fill="currentColor" style="opacity:0.3">
                  <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
                </svg>
                <p>No repositories found for "<strong>{{ store.searchQuery }}</strong>"</p>
              </div>

              <section
                v-for="cat in store.filteredCategories"
                :key="cat.slug"
                class="cat-section"
              >
                <h2 class="cat-heading">
                  {{ cat.name }}
                  <span class="cat-count">{{ cat.repos.length }}</span>
                </h2>
                <div
                  class="repo-grid"
                  :class="{ 'repo-list': store.viewMode === 'list' }"
                >
                  <RepoCard
                    v-for="card in cat.repos"
                    :key="card.id"
                    :card="card"
                    :list-mode="store.viewMode === 'list'"
                  />
                </div>
              </section>
            </div>
          </div>
        </template>
      </div>
    </main>

    <footer class="site-footer">
      <span>Powered by GitHub API · YAML-configured · <a href="https://github.com" target="_blank" rel="noopener">GitHub</a></span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNavStore } from './stores/nav'
import PinnedBar from './components/PinnedBar.vue'
import RepoCard from './components/RepoCard.vue'

const store = useNavStore()
const isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

function toggleDark() { isDark.value = !isDark.value }

onMounted(() => store.loadConfig())
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app {
  --bg: #f6f8fa;
  --header-bg: #ffffff;
  --card-bg: #ffffff;
  --border: #d0d7de;
  --text: #24292f;
  --text-muted: #57606a;
  --accent: #0969da;
  --tag-bg: #edf0f3;
  --shadow: rgba(0,0,0,0.08);
  --hover-bg: #f3f4f6;
  --error: #cf222e;
  --sk-from: #edf0f3;
  --sk-to: #d8dde3;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  transition: background 0.25s, color 0.25s;
}
.app.dark {
  --bg: #0d1117;
  --header-bg: #161b22;
  --card-bg: #161b22;
  --border: #30363d;
  --text: #e6edf3;
  --text-muted: #8b949e;
  --accent: #58a6ff;
  --tag-bg: #21262d;
  --shadow: rgba(0,0,0,0.4);
  --hover-bg: #21262d;
  --error: #f85149;
  --sk-from: #21262d;
  --sk-to: #30363d;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.brand { display: flex; align-items: center; gap: 12px; }
.gh-icon { color: var(--text); flex-shrink: 0; }
.site-title { font-size: 1rem; font-weight: 700; color: var(--text); line-height: 1.2; }
.site-sub { font-size: 0.72rem; color: var(--text-muted); }
.header-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.search-wrap { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 10px; color: var(--text-muted); pointer-events: none; }
.search-input {
  width: 220px;
  padding: 7px 32px 7px 30px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.15s, width 0.3s;
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: var(--accent); width: 280px; }
.clear-btn {
  position: absolute; right: 8px;
  background: none; border: none;
  color: var(--text-muted); cursor: pointer;
  font-size: 1rem; line-height: 1; padding: 2px;
}
.clear-btn:hover { color: var(--text); }

.toolbar { display: flex; align-items: center; gap: 8px; }
.sort-select {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text);
  font-size: 0.78rem;
  cursor: pointer;
  outline: none;
}
.view-toggle { display: flex; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
.view-toggle button, .theme-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: var(--card-bg); border: none;
  color: var(--text-muted); cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.view-toggle button:hover, .theme-btn:hover { background: var(--hover-bg); color: var(--text); }
.view-toggle button.active { background: var(--accent); color: white; }
.theme-btn { border: 1px solid var(--border); border-radius: 6px; }

.main { padding: 24px 0 48px; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

.layout { display: flex; gap: 28px; align-items: flex-start; margin-top: 24px; }

.sidebar {
  width: 180px; flex-shrink: 0;
  position: sticky; top: 72px;
  display: flex; flex-direction: column; gap: 2px;
}
.cat-btn {
  text-align: left; padding: 7px 12px;
  border: none; border-radius: 6px;
  background: none; color: var(--text-muted);
  font-size: 0.82rem; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.cat-btn:hover { background: var(--hover-bg); color: var(--text); }
.cat-btn.active { background: var(--hover-bg); color: var(--accent); font-weight: 600; }

.content { flex: 1; min-width: 0; }
.cat-section { margin-bottom: 40px; }
.cat-heading {
  font-size: 1rem; font-weight: 700; color: var(--text);
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
  padding-bottom: 8px; border-bottom: 1px solid var(--border);
}
.cat-count {
  font-size: 0.72rem; font-weight: 500;
  padding: 1px 7px; border-radius: 20px;
  background: var(--tag-bg); color: var(--text-muted);
}

.repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.repo-list { display: flex; flex-direction: column; gap: 8px; }

.global-loading {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding: 80px 0; color: var(--text-muted);
}
.spinner {
  width: 22px; height: 22px;
  border: 2px solid var(--border); border-top-color: var(--accent);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.global-error { text-align: center; padding: 60px 0; color: var(--error); }
.rate-notice {
  margin: 0 0 16px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  background: var(--tag-bg);
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}
.global-error button {
  margin-top: 12px; padding: 8px 20px;
  border: 1px solid var(--accent); border-radius: 6px;
  background: none; color: var(--accent); cursor: pointer; font-size: 0.85rem;
}
.empty-state {
  text-align: center; padding: 60px 0; color: var(--text-muted);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}

.site-footer {
  text-align: center; padding: 20px;
  font-size: 0.75rem; color: var(--text-muted);
  border-top: 1px solid var(--border);
}
.site-footer a { color: var(--accent); text-decoration: none; }

@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar { position: static; width: 100%; flex-direction: row; flex-wrap: wrap; }
  .search-input { width: 160px; }
  .search-input:focus { width: 200px; }
}
</style>
