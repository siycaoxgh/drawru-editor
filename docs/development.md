# 开发规范

> DrawRu v3.7.5 · Development Guidelines

## 环境要求

- 纯静态 HTML + CSS + JS，无需构建工具
- 浏览器直接打开 `index.html` 即可运行
- Node.js ≥ 18 用于运行归档回归脚本（`node archive/v3.5.5.bate-history/bugfix_test.js`）

## 代码规范

### 文件编码

- 所有 `.js` / `.html` / `.css` 文件使用 **UTF-8** 编码
- `.js` 文件允许 UTF-8 BOM（Windows PowerShell 写入时会自动添加）
- 禁止使用 GBK / ANSI 编码写入文件
- **推荐用 Node.js `fs.writeFileSync(path, content, 'utf-8')` 写文件**，避免 PowerShell `Set-Content` 破坏编码

### 模块规范

- 所有 JS 文件在文件末尾检查并导出：

```javascript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentOrFunction;
}
```

- 浏览器环境通过全局变量引用组件（`ImageComponent`、`TitleComponent` 等）
- 冻结文件（parser.js / renderer.js / clipboard.js / footer/index.js）不得直接修改

### JSDOc 注释

```javascript
/**
 * 函数描述
 * @param {string} alt - 图片描述
 * @param {string} src - 图片链接
 * @param {object} theme - 主题配置
 * @returns {string} HTML 字符串
 */
```

### 安全规范

1. **所有用户输入必须转义** — `escapeHtml()` 覆盖 `& < > " '`
2. **URL 协议过滤** — `javascript:` / `data:text/html` → `about:blank`
3. **HTML 属性值双引号** — `src="..."` 而非 `src='...'`
4. **禁止内联 `<script>`** — 生成的 HTML 中不得出现可执行脚本

### 微信兼容规范

- 块级容器：`<section>` 而非 `<div>`
- 所有元素：`background: transparent`
- 根容器：`background-color: transparent !important`
- 颜色格式：`#RRGGBB` 或 `rgb(r,g,b)`，禁用 `rgba()`
- 渐变/动画：使用 SVG data URI 替代 CSS gradient
- 字体：仅使用系统字体栈

## 测试规范

### CLI 测试（Node.js）

```bash
node archive/v3.5.5.bate-history/bugfix_test.js
```

- 每个 Phase 完成后运行对应测试
- 测试覆盖：旧语法回归、新功能验证、微信兼容、XSS 安全
- 参考实现：`workspace/*.js`（AutoClaw workspace 下的测试脚本）

### 浏览器测试

- 双击 `index.html` 直接打开
- 填写内容 → 点击"应用模板" → 查看预览
- 点击"复制到剪贴板" → 粘贴到微信公众号后台 → 检查样式
- 测试浏览器：Chrome / Edge（主要）/ Firefox

## 发布规范

### 版本号

`v3.5.5-beta` → `v3.5.5-rc1` → `v3.5.5` → `v3.6.0`

| 后缀 | 含义 |
|------|------|
| alpha | 功能开发中，接口可能变动 |
| beta | 功能完整，内部测试 |
| rc | Release Candidate，Bug 修复 + 稳定性验证 |
| （无后缀） | 正式发布 |

### CHANGELOG 格式

参考 `CHANGELOG.md` 现有格式：

```
# DrawRu vX.Y.Z

> 发布日期 · 状态

## ✨ 新增
## 🔧 修改
## 🐛 修复
## ⚠️ 已知限制
## 📊 测试
```

### 冻结文件修改流程

如需修改冻结文件（parser.js / renderer.js / clipboard.js / footer/index.js），必须先：

1. 在 evolution 中提出提案
2. 评估影响面（回退测试、微信兼容回归）
3. 用户审批后执行
4. 更新 `docs/v3.7-release-notes.md` 和 `CHANGELOG.md` 中的冻结文件清单
