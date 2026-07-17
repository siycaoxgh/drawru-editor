# 组件规范

> DrawRu v3.7.0 · Component System Specification

## 组件契约

每个组件暴露一个或一组渲染函数，接收数据 + 主题 → 返回 HTML 字符串。

```
Component.render(data, theme, layouts) → HTML
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | object/string | 节点数据（不同组件签名不同） |
| `theme` | object | 主题配置对象 |
| `layouts` | object | 布局函数库（可选） |
| 返回值 | string | 微信兼容的 HTML（全部使用 inline style） |

## 组件清单

### TitleComponent (`components/title.js`)

渲染章节标题，含金色编号 + 渐变装饰线。

```javascript
// 签名
TitleComponent.render(num, label, theme, layouts) → HTML

// 示例
TitleComponent.render("01", "【软件概览】", theme)
// → <section> 编号 + 装饰线 + 标签
```

### ParagraphComponent (`components/paragraph.js`)

渲染正文段落。

```javascript
ParagraphComponent.render(text, theme, layouts) → HTML
```

### ImageComponent (`components/image.js`)

渲染图片。**Phase 2-A 后有两个入口：**

```javascript
// 新入口（推荐，renderer.js 调用）
ImageComponent.renderNode(node, theme) → HTML

// 旧入口（保留兼容，委托到 renderNode）
ImageComponent.render(alt, src, theme, layouts) → HTML

// 带标题（已修复 XSS）
ImageComponent.renderWithCaption(alt, src, caption, theme, layouts) → HTML
```

**安全特性：**
- `escapeHtml()` 转义 alt/src/caption
- `javascript:` / `data:text/html` URL → `about:blank`
- `data:image/*` URL 白名单放行

### InfoComponent (`components/info.js`)

渲染信息列表行（标签：值）。

```javascript
InfoComponent.render(label, value, theme, layouts) → HTML
```

### QuoteComponent (`components/quote.js`)

渲染引用块。

```javascript
QuoteComponent.render(text, theme, layouts) → HTML
```

### DividerComponent (`components/divider.js`)

渲染分割线（三色圆点 + 虚线）。

```javascript
DividerComponent.render({ type }, theme, layouts) → HTML
// type: "triple" 顶部 | "bottom" 底部
```

## v3.7 图片比例规则

- 正文 ImageComponent：自然比例，使用 `width:100%; max-width:100%; height:auto; display:block`
- 正文图片不使用固定 16:9、`padding-top`、绝对定位或 `object-fit:cover`
- Header 图片保持原始比例，不裁剪
- RecommendCard 使用 `aspect-ratio:16/6` 和 `object-fit:cover`
- SocialCard 使用独立固定卡片结构

### FooterComponent (`components/footer.js`)

文章 Footer 包装器，委托到 `footer/index.js` 渲染。

### Assets (`components/assets.js`)

SVG 装饰资源库（圆点、虚线、椭圆等）。使用内联 data URI 避免外部加载。

```javascript
ASSETS.ellipse          // 椭圆 SVG
ASSETS.goldLine         // 金色渐变线
ASSETS.dash.long80      // 80px 虚线
ASSETS.dot.cyan10       // 青色 10px 圆点
```

## 组件开发规范

1. **所有 CSS 使用 inline style**，不依赖外部样式表
2. **块级容器使用 `<section>`**，禁用 `<div>`
3. **每个元素显式设置 `background: transparent`**
4. **用户输入必须转义**（`escapeHtml` 覆盖 `& < > " '`）
5. **新增入口保留旧签名**，添加 `@deprecated` 标记
6. **装饰元素使用 SVG data URI**，禁用 CSS gradient

## 数值单位规范

| 属性 | 单位 | 示例 |
|------|------|------|
| 字体大小 | `px` | `font-size: 16px` |
| 边距 | `px` | `margin: 10px 0px` |
| 宽度 | `px` 或 `%` | `width: 800px` / `max-width: 100%` |
| 圆角 | `px` | `border-radius: 10px` |
| 边框宽度 | `px` | `border-width: 2px` |
