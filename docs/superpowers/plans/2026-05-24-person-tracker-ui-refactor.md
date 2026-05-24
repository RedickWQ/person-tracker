# Person Tracker UI 重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 person-tracker UI，实现 Notion 风格的现代卡片设计、颜色系统和流畅动画

**Architecture:** 采用渐进式重构策略，保持现有布局结构，逐步优化 CSS 样式和动画效果

**Tech Stack:** React, CSS3 (变量、渐变、动画), Vite

---

## 文件结构

```
src/
├── index.css                    # 全局样式变量和动画定义
├── pages/
│   ├── Dashboard.css           # 仪表盘卡片样式
│   └── GoalDetailPage.css     # 目标详情页样式
└── components/
    ├── Common/
    │   ├── Card.css           # 卡片基础样式
    │   └── Button.css         # 按钮样式
    └── Goal/
        ├── ReadingTimer.css   # 阅读计时器样式
        └── GoalForm.css       # 目标表单样式
```

---

## 任务分解

### 任务 1: 全局样式更新 (index.css)

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 添加 CSS 变量定义主题色**

```css
:root {
  /* 目标类型颜色 */
  --color-side-business: #8B5CF6;
  --color-thinking: #06B6D4;
  --color-exercise: #10B981;
  --color-reading: #F59E0B;

  /* 渐变背景 */
  --gradient-side-business: linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%);
  --gradient-thinking: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%);
  --gradient-exercise: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  --gradient-reading: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);

  /* 动画 */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

- [ ] **Step 2: 添加全局动画 keyframes**

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: 更新页面动画类**

```css
.page {
  animation: fadeIn var(--transition-slow) ease-out;
}

.page-content {
  animation: slideUp var(--transition-slow) ease-out;
}
```

- [ ] **Step 4: 提交代码**

```bash
git add src/index.css
git commit -m "feat(ui): add CSS variables and global animations"
```

---

### 任务 2: 仪表盘卡片重构 (Dashboard.css)

**Files:**
- Modify: `src/pages/Dashboard.css`

- [ ] **Step 1: 更新卡片基础样式**

找到 `.goal-overview-card` 相关样式，替换为：

```css
.goal-overview-card {
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  border-radius: 20px;
  padding: 24px;
}

.goal-overview-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

- [ ] **Step 2: 更新目标类型渐变背景**

将四个变体颜色替换为：

```css
.goal-overview-card.variant-side-business {
  background: var(--gradient-side-business);
}

.goal-overview-card.variant-thinking {
  background: var(--gradient-thinking);
}

.goal-overview-card.variant-exercise {
  background: var(--gradient-exercise);
}

.goal-overview-card.variant-reading {
  background: var(--gradient-reading);
}
```

- [ ] **Step 3: 更新卡片文字样式**

```css
.goal-overview-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.goal-dates {
  font-size: 12px;
  color: #64748B;
  background: rgba(255, 255, 255, 0.5);
  padding: 4px 8px;
  border-radius: 8px;
}
```

- [ ] **Step 4: 更新徽章样式**

```css
.status-badge, .goal-type-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.3px;
  backdrop-filter: blur(4px);
}
```

- [ ] **Step 5: 更新进度条样式**

```css
.goal-progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  transition: width var(--transition-slow);
}
```

- [ ] **Step 6: 更新概览卡片样式**

```css
.overview-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.overview-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-normal);
}

.overview-card:hover .overview-icon {
  transform: scale(1.05);
}
```

- [ ] **Step 7: 提交代码**

```bash
git add src/pages/Dashboard.css
git commit -m "feat(ui): update dashboard cards with Notion style"
```

---

### 任务 3: 目标详情页样式优化 (GoalDetailPage.css)

**Files:**
- Modify: `src/pages/GoalDetailPage.css`

- [ ] **Step 1: 更新阅读计时器卡片样式**

找到 `.reading-time-card` 相关样式，替换为：

```css
.reading-time-card {
  margin-bottom: 24px;
  background: var(--gradient-reading);
  border-radius: 20px;
  border: none;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.reading-time-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

- [ ] **Step 2: 更新卡片通用样式**

找到 `.goal-overview` 并添加：

```css
.goal-overview {
  margin-bottom: 24px;
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-normal);
}

.goal-overview:hover {
  box-shadow: var(--shadow-lg);
}
```

- [ ] **Step 3: 更新通用卡片样式**

找到所有 Card 组件容器，添加统一圆角和阴影

- [ ] **Step 4: 提交代码**

```bash
git add src/pages/GoalDetailPage.css
git commit -m "feat(ui): update goal detail page styles"
```

---

### 任务 4: 通用组件样式优化

**Files:**
- Modify: `src/components/Common/Card.css`
- Modify: `src/components/Common/Button.css`

- [ ] **Step 1: 更新 Card.css**

```css
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

- [ ] **Step 2: 更新 Button.css**

```css
.button {
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 500;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}

.button:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: scale(0.98);
}
```

- [ ] **Step 3: 提交代码**

```bash
git add src/components/Common/Card.css src/components/Common/Button.css
git commit -m "feat(ui): update common components with smooth animations"
```

---

### 任务 5: 表单和模态框样式

**Files:**
- Modify: `src/components/Goal/GoalForm.css`
- Modify: `src/components/Common/Modal.jsx` (如果有样式)

- [ ] **Step 1: 更新表单输入框样式**

```css
.form-input, .form-textarea, .form-select {
  border-radius: 12px;
  padding: 12px 16px;
  border: 2px solid #E2E8F0;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-side-business);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}
```

- [ ] **Step 2: 提交代码**

```bash
git add src/components/Goal/GoalForm.css
git commit -m "feat(ui): update form styles with modern inputs"
```

---

### 任务 6: 最终验证和推送

- [ ] **Step 1: 本地运行验证**

```bash
npm run dev
```

- [ ] **Step 2: 检查所有页面样式一致性**
- 仪表盘卡片
- 目标详情页
- 表单模态框
- 按钮交互

- [ ] **Step 3: 构建并推送**

```bash
npm run build
git push origin main
```

- [ ] **Step 4: 验证部署成功**

访问 https://formattext2.com 确认 UI 更新生效

---

## 验证清单

- [ ] 四种目标类型有独特的渐变背景色
- [ ] 卡片 hover 有流畅的上浮动效
- [ ] 按钮有缩放和阴影变化动画
- [ ] 整体风格接近 Notion 的清爽柔和感
- [ ] 无样式冲突或布局错乱
