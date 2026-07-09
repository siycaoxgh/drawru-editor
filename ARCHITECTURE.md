# DrawRu 编辑器 - 架构说明文档

## 版本

v3.0 - 模块化重构版

## 概述

DrawRu 编辑器是一个将 Markdown 转换为微信公众号兼容 HTML 的工具。采用模块化架构，将解析、渲染、复制等功能分离，便于维护和扩展。

## 核心模块

### 1. 解析器 (parser.js)

**职责：** 将 Markdown 文本解析为结构化节点数组

**输入：** Markdown 文本字符串

**输出：** 节点数组

```javascript
// 示例输入
`01
【软件概览】
软件名称：TestApp`

// 示例输出
[
  { type: 'title', num: '01', label: '【软件概览】' },
  { type: 'info', label: '软件名称：', value: 'TestApp' }
]
```

**支持的节点类型：**
- `title` - 章节标题 (01, 02...)
- `subtitle` - 小标题 (【标题】)
- `paragraph` - 普通段落
- `image` - 图片
- `info` - 信息列表 (标签：值)
- `list` - 有序列表
- `quote` - 引用

### 2. 渲染器 (renderer.js)

**职责：** 将节点数组渲染为微信公众号兼容的 HTML

**输入：** 节点数组

**输出：** HTML 字符串

**设计模式：** 使用组件化设计，每个节点类型对应一个组件

```javascript
class MarkdownRenderer {
    renderNodes(nodes) {
        // 遍历节点，调用对应组件
    }
    
    renderArticle(nodes) {
        // 渲染完整文章（含头部、分割线、尾部）
    }
}
```

### 3. 组件系统 (components/*)

**职责：** 生成特定类型的 HTML

**基类接口：**
```javascript
const Component = {
    render(data, theme) {
        return '<section>...</section>';
    }
};
```

**组件列表：**

| 组件 | 文件 | 渲染内容 |
|------|------|----------|
| TitleComponent | title.js | 01/02 章节标题 + 渐变线 |
| ParagraphComponent | paragraph.js | 普通段落 |
| ImageComponent | image.js | 图片容器 |
| QuoteComponent | quote.js | 引用区块 |
| DividerComponent | divider.js | 三色分割线 |
| FooterComponent | footer.js | 顶部关注 + END |

### 4. 剪贴板模块 (clipboard.js)

**职责：** 实现富文本复制到系统剪贴板

**API：**
```javascript
async function copyHTML(html) {
    // 使用 ClipboardItem API
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([纯文本], { type: 'text/plain' });
    
    const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob
    });
    
    await navigator.clipboard.write([item]);
}
```

**为什么用 ClipboardItem：**
- `document.execCommand('copy')` 只能复制纯文本
- `ClipboardItem` 可以同时携带 HTML 和纯文本
- 微信公众号编辑器能识别 `text/html` 格式

### 5. 主题系统 (themes/*)

**职责：** 定义颜色、字体等视觉配置

```javascript
const THEME = {
    name: 'default',
    colors: {
        gold: '#ffbd4a',      // 金色 - 标题
        light: '#afcfee',     // 浅蓝 - 装饰
        cyan: '#44d9e6',      // 青色 - 点缀
        blue: '#2eb3ff',      // 蓝色 - 链接
        text: '#3e3e3e'       // 正文色
    }
};
```

## 数据流

```
┌─────────────┐
│ Markdown   │
│   文本      │
└─────┬───────┘
      │ parseMarkdown()
      ▼
┌─────────────┐
│  节点数组    │
│  (nodes)    │
└─────┬───────┘
      │ MarkdownRenderer.renderNodes()
      ▼
┌─────────────┐
│ HTML 字符串 │
└─────┬───────┘
      │ copyHTML()
      ▼
┌─────────────┐
│ Clipboard   │
│  Item       │
└─────────────┘
```

## 微信兼容性策略

### 1. 标签选择
- ❌ 避免 `<div>` → ✅ 使用 `<section>`
- ❌ 避免 `<span>` 用于块级 → ✅ 仅用于行内

### 2. 样式处理
- ✅ 所有元素加 `background: transparent`
- ✅ 根容器加 `background-color: transparent !important`
- ❌ 避免 `linear-gradient` → ✅ 使用 SVG 渐变

### 3. 图片处理
- ✅ 使用 `<img>` 标签
- ✅ 图片样式用 inline style
- ✅ 加 `display: block` 消除间隙

### 4. 装饰元素
- ✅ 使用 SVG Data URI 内嵌图片
- ✅ 避免 CSS 背景图

## 扩展指南

### 添加新的 Markdown 语法

1. 在 `parser.js` 添加解析逻辑
2. 在 `components/` 创建新组件
3. 在 `renderer.js` 的 switch 中添加 case

### 示例：添加无序列表

```javascript
// 1. parser.js
if (line.startsWith('-')) {
    nodes.push({ type: 'ul', text: line.substring(1).trim() });
}

// 2. components/ul.js
const UlComponent = {
    render(text, theme) {
        return `<section>• ${text}</section>`;
    }
};

// 3. renderer.js
case 'ul':
    html += UlComponent.render(node.text, this.theme);
```

## 文件依赖关系

```
index.html
├── css/style.css
└── js/
    ├── config.js          ← 无依赖
    ├── theme.js           ← 依赖 config
    ├── components/*       ← 依赖 theme
    ├── clipboard.js       ← 无依赖
    ├── parser.js          ← 无依赖
    ├── renderer.js        ← 依赖 components
    └── app.js             ← 依赖所有模块
```

## 测试清单

- [ ] Parser 正确解析所有节点类型
- [ ] Renderer 生成有效的 section 标签
- [ ] 所有元素包含 background: transparent
- [ ] 根容器包含 background-color: transparent !important
- [ ] ClipboardItem API 正常工作
- [ ] 复制后粘贴到微信编辑器保持格式
