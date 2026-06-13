# GitHub Stars Navigation

专为收藏 GitHub 顶级仓库设计的导航站，纯前端实现。

## 技术栈

- **Vue 3** + Composition API
- **Vite** 构建工具
- **TypeScript** 类型安全
- **Pinia** 状态管理
- **js-yaml** 配置文件解析
- **GitHub REST API** 实时数据（带 30 分钟本地缓存）

## 功能特性

- 📌 **Pin 置顶** — `repos.yaml` 中配置 pinned 仓库，顶部横条展示
- 🗂 **分类导航** — 侧边栏按 category 快速筛选
- 🔍 **全文搜索** — 按名称 / 描述 / 标签实时过滤
- ↕️ **排序** — 默认 / 最多 Star / 字母序
- ⊞ **视图切换** — 卡片网格 / 列表视图
- 🌙 **暗色模式** — 跟随系统或手动切换
- ⚡ **骨架屏** — GitHub API 加载前优雅占位
- 💾 **本地缓存** — localStorage 缓存 30 分钟，减少 API 请求

## 快速开始

```bash
npm install
npm run dev
```

## 添加仓库

编辑 `public/repos.yaml`：

```yaml
pinned:
  - id: owner/repo           # 格式: owner/repo

categories:
  - name: 分类名称
    slug: category-slug
    repos:
      - id: owner/repo
        desc: 自定义描述（可选，会被 GitHub API 描述覆盖）
        tags: [tag1, tag2]   # 自定义标签（可选）
```

## 构建部署

```bash
npm run build   # 输出到 dist/
```

`dist/` 目录可直接部署到 GitHub Pages、Vercel、Netlify 等静态托管平台。
