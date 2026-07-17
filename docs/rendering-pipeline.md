# 渲染链路

> v3.7.0 · parser.js → enrich-image.js → renderer.js → clipboard.js

## 第一阶段：Markdown → AST（parser.js）

### Tokenize

按行逐行解析，支持以下 token 类型：

| Token | 匹配规则 | 示例 |
|-------|---------|------|
| `heading` | `##` / `###` 开头 | `## 01 软件概览` |
| `image` | `![alt](url)` 独占行 | `![截图](https://x.com/img.png)` |
| `image_attrs` | 图片下一行 `{key=value …}` | `{width=800 caption="说明"}` |
| `text` | 普通文本 | `软件名称：TestApp` |
| `list_item` | `- ` 或 `1. ` | `- 功能A` |
| `quote` | `> ` 开头 | `> 引用文字` |
| `info` | `标签：值` 格式 | `版本：V1.0` |
| `number` + `label` | 旧格式 `01` + `【标题】` | 兼容语法 |
| `blank` | 空行 | 分隔用 |

### 特殊语法（Phase 2）

**asset: 协议：**
```
![截图](asset:img001)
```
tokenize 识别 `asset:` 前缀后拆分：

```javascript
{ type: "image", alt: "截图", src: "", assetId: "img001" }
```

**图片属性块：**
```
![截图](https://x.com/img.png)
{width=800 height=600 border=false caption="系统架构"}
```
属性值自动推断类型：`true/false` → 布尔，`123` → 数字，`"x"` → 字符串。

### buildAST

将 tokens 按类型转换为 AST 节点：

```javascript
// 图片节点
{
  type: AST_NODE_TYPES.IMAGE,  // "image"
  alt: "截图",
  src: "https://x.com/img.png",
  assetId: "img001",           // 来自 asset: 协议
  width: 800,                  // 来自属性块
  caption: "系统架构"           // 来自属性块
}
```

### astToNodes

将 AST 转换为 Renderer 兼容的 nodes。图片节点透传全部 12 个字段（alt/src/width/height/align/border/caption/title/assetId/format/size/variants）。

## 第二阶段：图片节点增强（enrich-image.js）

运行位置：`parseMarkdown() → enrichImageNodes() → renderer.renderArticle()`

```javascript
nodes = parseMarkdown(md);
enriched = enrichImageNodes(nodes);  // ← 补齐默认值
html = renderer.renderArticle(enriched);
```

### 默认值补齐

```
enriched.title   = node.title   || ''
enriched.width   = node.width   || null
enriched.height  = node.height  || null
enriched.align   = node.align   || 'center'
enriched.border  = node.border  !== false   // 默认 true
enriched.caption = node.caption || ''
enriched.assetId = node.assetId || ''
enriched.format  = node.format  || ''
enriched.size    = node.size    || null
enriched.variants= node.variants || {}
```

### assetId → src 解析

```javascript
if (enriched.assetId && !enriched.src) {
    var r = ImageAssetManager.resolve({ assetId }, ImageAssetManager.store);
    if (r.url) enriched.src = r.url;
}
```

如果 ImageAssetManager 不可用（浏览器环境未加载），静默 fallback，src 保持空字符串。

## 第三阶段：Nodes → HTML（renderer.js）

```javascript
class MarkdownRenderer {
  renderNodes(nodes) {
    // 遍历节点，按 type 分发到组件：
    // title    → TitleComponent.render()
    // subtitle → ParagraphComponent.render()
    // image    → ImageComponent.renderNode(node, theme)
    // info     → InfoComponent.render()
    // list     → ListComponent.render()
    // quote    → QuoteComponent.render()
    // paragraph→ ParagraphComponent.render()
  }

  renderArticle(nodes) {
    // 外层 section 容器 + Header + 顶部分割线 +
    // renderNodes(nodes) + 底部分割线 + END + Footer
  }
}
```

**图片渲染（image.js）：**
- `renderNode(node, theme)` — 统一入口
  - 尺寸 CSS：`width:800px;height:600px`
  - 对齐：`text-align: left|center|right`
  - 边框：`border-style:dotted`（可关闭）
  - 标题：`<p>转义后的 caption</p>`
- `escapeHtml()` — 转义 `& < > " '` 五个字符
- `src` 安全过滤 — `javascript:` / `data:text/html` → `about:blank`

## 第四阶段：HTML → 剪贴板（clipboard.js）

```
主路由：iframe + execCommand('copy')
  → 独立 document 避免主页面 CSS 污染
  → body 设置 background: transparent

降级路由：ClipboardItem API
  → 同时携带 text/html 和 text/plain
```

## 验证清单

- [ ] `<section>` 无 `<div>`
- [ ] `background: transparent` 全覆盖
- [ ] `display: block` + `max-width:100%` 所有图片
- [ ] 无 `javascript:` / `data:text/html` URL
- [ ] 无 `<style>` / `<script>` 标签
- [ ] section 标签配对平衡
- [ ] 纯文本提取包含正文内容
