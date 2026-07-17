# DrawRu 编辑器 — 架构总览

> v3.7.5 · 2026-07-17
> 定位：Markdown → 微信公众号 HTML 渲染器

## 项目结构

```
drawru-editor/
├── index.html                  # 入口页面（双击直接打开）
├── css/style.css               # 编辑器 UI 样式
├── components/                 # 渲染组件（每个对应一种 AST 节点）
│   ├── image.js                # 图片组件（renderNode + 安全过滤）
│   ├── title.js                # 章节标题
│   ├── paragraph.js            # 段落
│   ├── quote.js                # 引用
│   ├── info.js                 # 信息列表
│   ├── divider.js              # 分割线
│   ├── footer.js               # 文章 Footer
│   └── assets.js               # SVG 装饰资源（圆点、虚线等）
├── js/                         # 核心逻辑
│   ├── parser.js               # Markdown → AST → Renderer Nodes
│   ├── enrich-image.js         # 图片节点增强（默认值补齐 + assetId 解析）
│   ├── renderer.js             # Nodes → 微信兼容 HTML
│   ├── clipboard.js            # 富文本复制到微信（iframe + execCommand）
│   ├── app.js                  # 主应用（模板、表单、事件绑定）
│   ├── config.js               # 全局颜色/字体/样式常量
│   ├── theme-manager.js        # 主题收集与切换
│   ├── template-browser.js     # 模板引擎（浏览器版）
│   └── form-browser.js         # 表单引擎（浏览器版）
├── themes/                     # 主题配置
│   ├── default.js              # 默认主题
│   └── software.js             # 软件分享主题
├── layouts/core.js             # 布局函数（flex / inline-block）
├── footer/index.js             # Footer 渲染引擎（END / 版权 / 社交）
├── assets/                     # 静态资源
│   ├── footer/socials.js       # 社交平台数据（window.DRAW_RU_SOCIALS）
│   └── images/                 # 图片资产层（本地缓存，不上传）
│       ├── index.js            # ImageAssetManager 统一导出
│       ├── store.js            # 内存存储 + toRegistry/loadRegistry
│       ├── validator.js        # 字段校验
│       ├── resolver.js         # URL 解析（assetId → src）
│       ├── registry.json       # 持久化缓存
│       └── importers/picgo.js  # PicGo 输出格式转换（一次性工具）
├── docs/                       # 本文档集
└── archive/                    # 历史版本与测试/验证脚本（单独的仓库）
```

## 核心数据流

```
用户 Markdown
    │
    ▼
┌─────────────┐
│  parser.js   │  Tokenize → AST → astToNodes
│              │  支持语法：
│              │  - ![alt](url)                 旧 URL 语法
│              │  - ![alt](url) {width=…}       扩展属性
│              │  - ![alt](asset:xxxxx)          asset 协议
└──────┬──────┘
       │ nodes[]
       ▼
┌──────────────────┐
│ enrich-image.js   │  补齐默认值 + assetId→src 解析
│                   │  ImageAssetManager.resolve()
└──────┬───────────┘
       │ enriched nodes[]
       ▼
┌──────────────┐
│  renderer.js  │  renderArticle(nodes)
│               │  → renderNodes() 遍历节点
│               │  → ImageComponent.renderNode(node, theme)
│               │  → Footer + Divider
└──────┬───────┘
       │ HTML 字符串
       ▼
┌───────────────┐
│ clipboard.js   │  iframe + execCommand → 系统剪贴板
│                │  Fallback: ClipboardItem API
└───────┬───────┘
        │ text/html MIME
        ▼
    微信公众号编辑器
```

## 冻结文件（禁止修改）

| 文件 | 原因 |
|------|------|
| `js/parser.js` | 解析链路已验证，修改需重新评估影响面 |
| `js/renderer.js` | 渲染调度稳定，组件路由已闭环 |
| `js/clipboard.js` | 微信复制方案已通过真机验证 |
| `footer/index.js` | 多模板样式对齐，修改风险高 |

新增能力通过以下方式实现，不修改冻结文件：
1. **外层 enrich** — parser 与 renderer 之间插入（如 `enrich-image.js`）
2. **组件接口扩展** — 组件新增方法并保留旧签名兼容（如 `image.js renderNode()`）
3. **新建独立模块** — 如 `assets/images/` 资产层

## Image Node 协议 v2.0

```javascript
{
  type: "image",
  alt: "描述文本",
  src: "https://example.com/photo.jpg",

  // 显示控制（Phase 2-B1）
  width: 800,          // px, null = 自适应
  height: 600,
  align: "center",     // left | center | right
  border: true,        // 主题虚线边框
  caption: "图注",     // 转义后渲染为 <p>
  title: "",           // HTML title 属性

  // 资产协议（Phase 2-B1.5，可选，为本地缓存预留）
  assetId: "img_001",
  format: "image/png",
  size: 245760,
  variants: { thumb, medium, full }
}
```

## 微信兼容要点

- 所有块级容器使用 `<section>`，禁止 `<div>`
- 所有元素设置 `background: transparent`
- 根容器 `background-color: transparent !important`
- 图片 `display: block` 消除行内间隙
- 装饰元素使用内联 SVG data URI，禁用 CSS gradient
- 复制使用 iframe+execCommand 主路由，ClipboardItem 为 fallback
- 颜色统一使用 `#RRGGBB` 格式，禁用 rgba()
