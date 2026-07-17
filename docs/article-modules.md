# 文章模板模块

> DrawRu v3.7.0 · v3.7 发布说明

## 模块概览

一个完整的 DrawRu 文章由以下可选模块组成（从上到下）：

| 顺序 | 模块 | 配置文件 | 渲染器 | 是否必选 |
|------|------|---------|--------|---------|
| 1 | 顶部引导图片 | `header-images.js` | `header-images-renderer.js` | 否 |
| 2 | 正文 Markdown | 用户在编辑器中输入 | parser+renderer | 是 |
| 3 | Footer | `footer/index.js` + `themes/*.js` | FooterRenderer | 是 |
| 4 | 推荐文章 | `recommend.js` | `recommend-renderer.js` | 否 |
| 5 | 社交引导 | `socials/social-guide.js` | （已有） | 否 |
| 6 | 点赞/分享/在看/留言 | `action-guide.js` | `action-guide-renderer.js` | 否 |

## 各模块说明

### 1. 顶部引导图片（Header Images）

**文件：** `assets/article/header-images.js` + `header-images-renderer.js`

文章开头展示的固定图片（非文章内容图片，属于模板装饰）。

```javascript
// header-images.js
var DRAW_RU_HEADER_IMAGES = [
    { src: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg", alt: "", width: "800", height: "400", link: "" },
    { src: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg", alt: "", width: "800", height: "400", link: "" }
];
```

- `src` — COS 图片 URL
- `alt` — 图片描述（可选）
- `width/height` — 尺寸（px，可选）
- `link` — 点击跳转链接（可选）

**空配置（默认）= 不渲染此模块。**

### 2. 正文 Markdown

编辑器核心功能。支持标准 Markdown + 图片扩展语法 + asset 协议。

### 3. Footer

文章尾部的 END 标记 + 版权声明 + 社交矩阵。配置在主题文件和 `assets/footer/socials.js` 中。

### 4. 推荐文章（Recommend）

**文件：** `assets/article/recommend.js` + `recommend-renderer.js`

推荐其他文章。2×2 卡片网格布局，最多 4 篇。

推荐卡片图片使用 16:6 比例，但不使用 `padding-top:37.5%`。微信保存时可能保留 padding、移除图片绝对定位，从而产生图片前方空白。当前使用 `aspect-ratio:16/6` 配合 `width:100%; height:100%; object-fit:cover`。

```javascript
var DRAW_RU_RECOMMENDS = [
    { title: "文章标题1", image: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg", url: "" },
    { title: "文章标题2", image: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg", url: "" },
    // title 和 image 都非空才渲染，最多取前 4 个
];
```

配置面板中，推荐标题和图片 COS 链接必须同时填写。只填写图片链接而未填写标题时，该推荐项会被跳过，因此预览中不会加载推荐模块。

位置：Footer 版权信息之后。

### 5. 社交引导（Social Guide）

已有模块，展示公众号/小红书/抖音/B站等平台引导。图标可替换为 COS URL。

### 6. 操作引导（Action Guide）

**文件：** `assets/article/action-guide.js` + `action-guide-renderer.js`

纯视觉引导按钮（点赞/分享/在看/留言），不接微信 API。

```javascript
var DRAW_RU_ACTIONS = [
    { type: "like",    text: "点赞", icon: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg" },
    { type: "share",   text: "分享", icon: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg" },
    { type: "wow",     text: "在看", icon: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg" },
    { type: "comment", text: "留言", icon: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg" }
];
```

位置：社交引导之后、文章末尾。

## 图片替换方法

所有模块图片均为 COS URL，替换方式：

1. 将图片上传到腾讯云 COS
2. 复制 COS 图片 URL
3. 打开对应的 `.js` 配置文件
4. 修改 `src` / `image` / `icon` 字段
5. 刷新编辑器页面

## 渲染兼容

所有模块输出遵循微信兼容规则：

- `<section>` 替代 `<div>`
- `background: transparent` 全覆盖
- 图片使用 `crossorigin="anonymous"` + `class="raw-image"`
- 零外部 CSS 依赖，全部 inline style
