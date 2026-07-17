# 主题规范

> DrawRu v3.7.0 · Theme System Specification

## 主题结构

```javascript
{
  name:        "default",           // 主题名称
  description: "默认主题",          // 描述

  colors: {                         // 颜色系统
    gold:       "rgb(255, 189, 74)",
    goldHex:    "#ffbd4a",
    lightBlue:  "rgb(175, 207, 238)",
    lightBlueHex: "#afcfee",
    cyan:       "rgb(68, 217, 230)",
    cyanHex:    "#44d9e6",
    blue:       "rgb(46, 179, 255)",
    blueHex:    "#2eb3ff",
    text:       "rgb(62, 62, 62)",
    textHex:    "#3e3e3e",
    white:      "rgb(255, 255, 255)",
    whiteHex:   "#ffffff"
  },

  fonts: {                          // 字体系统
    chapterNumber: { fontSize, fontWeight, color, textDecoration },
    subtitle:      { fontSize, color },
    body:          { fontSize, lineHeight, color },
    label:         { fontSize, color },
    special:       { fontFamily: "PangMenZhengDao, sans-serif" },
    tag:           { fontFamily: "PangMenZhengDao, sans-serif" },
    actionButton:  { fontSize }
  },

  components: {                     // 组件视觉开关
    title: {
      layout: "number-inline",     // default：编号与标题同排
      labelColor: "text",
      labelTextDecoration: "none",
      gap: "10px"
    }
  },

  spacing: {                        // 间距系统
    containerPadding: "0px",
    paragraph:  "0px 0px 16px",
    section:    "10px 0px",
    image:      "10px 0px",
    endDivider: "14px 0px"
  },

  borders: {                        // 边框系统
    image: { borderWidth, borderStyle: "dotted", borderColor, borderRadius },
    card:  { borderWidth, borderStyle: "dashed", borderColor, borderRadius },
    endLine: { borderWidth, borderStyle: "dotted", borderColor }
  },

  decorations: {                    // 装饰系统
    ellipse: { width, height, rotate, borderWidth, borderStyle, borderColor },
    icon:    { backgroundColor, padding, fontSize },
    tripleDots: { size, borderRadius },
    tripleLine: { borderWidth, borderStyle, borderColor }
  },

  footer: {                         // Footer 配置
    copyright: { year, author, type, fontSize, color },
    socials: window.DRAW_RU_SOCIALS || []  // 来自 assets/footer/socials.js
  },

  getColor: function(name) {        // 颜色获取方法（必须实现）
    return this.colors[name] || this.colors.text;
  }
}
```

## 加载机制

`index.html` 按顺序加载所有主题：

```html
<script src="themes/default.js"></script>     <!-- 必须第一个 -->
<script src="themes/software.js"></script>
```

`js/theme-manager.js` 收集所有已注册主题：

```javascript
window.AppTheme = {
  list: [DEFAULT_THEME, SOFTWARE_THEME],
  current: "software",
  get: function() { return this.list[1]; }
};
```

## 微信兼容规则

### 颜色格式
- ✅ `rgb(255, 189, 74)` — 推荐
- ✅ `#ffbd4a` — 推荐
- ❌ `rgba(255, 189, 74, 0.5)` — 微信不支持
- ❌ `hsl()` — 微信不支持

### 字体限制
- 只能使用系统安装的字体
- `PangMenZhengDao` 是特殊字体，非系统默认，需要用户已安装
- 后备字体：`-apple-system, BlinkMacSystemFont, sans-serif`

### 禁止项
- CSS `linear-gradient` → 改用 SVG data URI
- CSS `@keyframes` 动画 → 微信不支持
- 外部字体加载 `@font-face` → 微信不支持
- `<div>` 标签 → 改用 `<section>`

## 自定义主题示例

```javascript
var MY_THEME = Object.assign({}, DEFAULT_THEME, {
  name: "my-custom",
  description: "自定义主题",
  colors: Object.assign({}, DEFAULT_THEME.colors, {
    gold: "rgb(0, 128, 0)",
    goldHex: "#008000"
  })
});
```

修改后需要在 `index.html` 中加载并在 ThemeManager 中注册。

## v3.7 默认模板标题规则

`default` 主题启用 `components.title.layout = "number-inline"`：

```text
01  软件概览
```

- 编号使用 `gold` 橙色并保留下划线。
- 标题使用 `text` 黑色，不带下划线。
- 编号和标题在同一行显示。
- `software` 主题不设置该开关，因此继续使用原有标题结构和视觉效果。
