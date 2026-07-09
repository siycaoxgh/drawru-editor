# DrawRu 编辑器

微信公众号 Markdown 编译器 - v3.0

## 功能特性

- 📝 Markdown 转微信公众号 HTML
- 📋 富文本剪贴板复制（ClipboardItem API）
- 🎨 自定义主题颜色
- 🔧 模块化架构，易于扩展

## 项目结构

```
drawru-editor/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── config.js          # 配置文件
│   ├── clipboard.js       # 剪贴板复制
│   ├── parser.js          # Markdown 解析器
│   └── renderer.js        # HTML 渲染器
├── components/
│   ├── title.js           # 章节标题组件
│   ├── paragraph.js       # 段落组件
│   ├── image.js           # 图片组件
│   ├── quote.js           # 引用组件
│   ├── divider.js         # 分割线组件
│   └── footer.js          # 页脚组件
├── themes/
│   └── default.js         # 默认主题
└── tests/
    └── test.html          # 测试用例
```

## 模块说明

| 模块 | 职责 |
|------|------|
| `parser.js` | 解析 Markdown 文本为节点数组 |
| `renderer.js` | 将节点数组渲染为 HTML |
| `clipboard.js` | 富文本复制到剪贴板 |
| `components/*` | 各类排版组件 |

## 使用方法

### 本地运行

```bash
# 启动本地服务器
cd drawru-editor
python -m http.server 8080

# 访问
http://localhost:8080/
```

### Markdown 语法

```
01                 # 章节编号
【小标题】          # 带方括号的小标题
软件名称：值        # 信息列表
![描述](链接)      # 图片
> 引用文本          # 引用
1. **加粗** 文本    # 有序列表
```

### 示例

```markdown
01
【软件概览】
软件名称：TestApp
软件大小：10MB

![封面图](https://example.com/image.jpg)

02
【功能介绍】
> 这是一条引用

1. **功能一：** 说明
2. **功能二：** 说明
```

## 架构设计

### 数据流

```
Markdown 文本
    ↓
parser.parseMarkdown()
    ↓
节点数组 [{type, ...}]
    ↓
MarkdownRenderer.renderArticle()
    ↓
微信公众号 HTML
    ↓
clipHTML() → ClipboardItem
    ↓
微信公众号编辑器粘贴
```

### 组件接口

每个组件实现统一的 render 接口：

```javascript
const Component = {
    render(data, theme) {
        return '<section>...</section>';
    }
};
```

## 开发指南

### 添加新组件

1. 在 `components/` 创建 `NewComponent.js`
2. 导出 `render(data, theme)` 函数
3. 在 `renderer.js` 中引入并使用

```javascript
// components/new.js
const NewComponent = {
    render(data, theme) {
        return `<section style="...">${data}</section>`;
    }
};
```

### 添加新主题

1. 在 `themes/` 创建 `theme-name.js`
2. 导出主题配置

```javascript
const THEME = {
    name: 'dark',
    colors: {
        gold: '#fff',
        light: '#333',
        cyan: '#0ff',
        blue: '#00f',
        text: '#eee'
    }
};
```

## 微信兼容性

- ✅ 使用 `<section>` 替代 `<div>`
- ✅ 所有元素加 `background: transparent`
- ✅ 根容器加 `background-color: transparent !important`
- ✅ 装饰使用 SVG Data URI
- ✅ 使用 ClipboardItem API 复制富文本

## 测试

打开 `tests/test.html` 运行单元测试。

## License

MIT
