# 微信公众号 HTML 兼容规则

本文档记录 DrawRu 编辑器在生成微信公众号兼容 HTML 时遵循的规则。

## 1. 标签选择规则

### 1.1 使用 section 而非 div

**规则：** 所有块级容器必须使用 `<section>` 标签，禁止使用 `<div>`。

**原因：** 微信编辑器对 `<section>` 的兼容性优于 `<div>`，后者容易被添加灰色背景。

**实现：**
```javascript
// 在 renderArticle 结尾全局替换
html = html.replace(/<div/gi, '<section').replace(/<\/div>/gi, '</section>');
```

### 1.2 禁止使用 span 作为块级容器

**规则：** `<span>` 仅用于行内元素，不得用于块级布局。

**正确用法：**
```html
<section style="display: flex;">
    <span>行内内容</span>
</section>
```

**错误用法：**
```html
<span style="display: block;">这是错误的</span>
```

## 2. 样式规则

### 2.1 背景色透明

**规则：** 所有元素必须显式设置 `background: transparent`。

**原因：** 微信编辑器默认会为没有背景色的块级元素添加灰色背景。

**实现：**
```javascript
const CONFIG = {
    styles: {
        transparent: 'background: transparent;',
        sectionBase: 'margin: 0; background: transparent;'
    }
};
```

### 2.2 根容器强制透明

**规则：** 文章根容器必须添加 `background-color: transparent !important`。

**实现：**
```javascript
html += `<section style="background-color: transparent !important; padding: 10px;">`;
```

### 2.3 避免使用 linear-gradient

**规则：** CSS 渐变在微信中支持不稳定，应使用 SVG 替代。

**错误用法：**
```css
background: linear-gradient(to right, #ffbd4a, transparent);
```

**正确用法：**
```html
<img src="data:image/svg+xml,..." />
```

### 2.4 图片 display: block

**规则：** 所有图片必须设置 `display: block` 以消除行内元素导致的间隙。

**实现：**
```javascript
const CONFIG = {
    styles: {
        image: 'display: block; max-width: 100%; margin: 0 auto;'
    }
};
```

## 3. 图片资源规则

### 3.1 使用 SVG Data URI

**规则：** 装饰性图片（渐变线、圆点、虚线等）使用内联 SVG，避免外部图片加载失败。

**格式：**
```javascript
const ASSETS = {
    goldLine: `data:image/svg+xml,%3Csvg xmlns='...'...%3E%3C/svg%3E`
};
```

### 3.2 图片 URL 占位符

**规则：** 生成代码时使用占位符图片，便于用户在秀米中替换。

**格式：**
```html
<img src="https://example.com/image.jpg" alt="描述" />
```

## 4. 富文本复制规则

### 4.1 使用 ClipboardItem API

**规则：** 复制到剪贴板必须使用 `ClipboardItem` API，同时携带 HTML 和纯文本。

**实现：**
```javascript
async function copyHTML(html) {
    const blob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([plainText], { type: 'text/plain' });
    
    const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob
    });
    
    await navigator.clipboard.write([item]);
}
```

### 4.2 禁止使用 execCommand

**规则：** `document.execCommand('copy')` 只能复制纯文本，不得使用。

### 4.3 纯文本备选

**规则：** 必须同时提供 `text/plain` 格式作为降级方案。

## 5. 字体与颜色规则

### 5.1 使用系统字体栈

**规则：** 使用跨平台兼容性好的字体栈。

**实现：**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
```

### 5.2 颜色使用十六进制

**规则：** 所有颜色使用 `#RRGGBB` 格式，避免 rgba 导致兼容问题。

### 5.3 颜色常量集中管理

**规则：** 所有颜色定义在 `config.js` 的 `colors` 对象中。

```javascript
const CONFIG = {
    colors: {
        gold: '#ffbd4a',
        light: '#afcfee',
        cyan: '#44d9e6',
        blue: '#2eb3ff',
        text: '#3e3e3e'
    }
};
```

## 6. 布局规则

### 6.1 宽度使用百分比

**规则：** 布局宽度使用百分比，避免固定像素值。

```html
<section style="width: 100%;">
    <img src="..." style="max-width: 100%;" />
</section>
```

### 6.2 使用 flex 布局

**规则：** 列表布局使用 flex 代替 table。

```html
<section style="display: flex; margin-bottom: 8px;">
    <span style="width: 90px;">标签：</span>
    <span>值</span>
</section>
```

## 7. 禁止使用的特性

| 特性 | 原因 |
|------|------|
| `<div>` | 微信会添加灰色背景 |
| CSS `linear-gradient` | 部分微信版本不支持 |
| `rgba()` 颜色 | 可能导致兼容问题 |
| 外部 CSS 文件 | 微信编辑器会忽略 |
| JavaScript | 微信不支持文章内脚本 |
| 外部字体加载 | 可能加载失败 |
| CSS `@keyframes` | 微信不支持动画 |

## 8. 验证清单

生成 HTML 后，确保满足以下条件：

- [ ] 所有块级容器是 `<section>`
- [ ] 每个元素有 `background: transparent`
- [ ] 根容器有 `background-color: transparent !important`
- [ ] 图片有 `display: block`
- [ ] 没有 CSS `linear-gradient`
- [ ] 装饰使用 SVG Data URI
- [ ] 颜色使用 `#RRGGBB` 格式
- [ ] 使用 `ClipboardItem` 复制

## 9. 常见问题

### Q: 为什么还是有灰色背景？

A: 检查以下几点：
1. 是否有遗漏的 `<div>` 标签
2. 是否有元素缺少 `background: transparent`
3. 根容器是否加了 `!important`

### Q: 为什么渐变线显示不出来？

A: 不要用 CSS `linear-gradient`，改用 SVG 内联图片。

### Q: 为什么复制后格式丢失？

A: 确保使用 `ClipboardItem` API，同时提供 `text/html` 和 `text/plain`。
