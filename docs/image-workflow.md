# DrawRu v3.7.0 — 图片工作流程

## 当前架构

DrawRu 的图片系统分三层：

### 1. Markdown 图片（主要方式）

```markdown
![图片](https://example.com/202607121126570.jpg)
```

直接在 Markdown 中使用 HTTPS URL。解析后由 `ImageComponent.renderNode()` 渲染为微信公众号兼容的 section 结构。

### 2. 图片属性扩展

在图片行下方添加属性块（Phase 2-B1）：

```markdown
![图片](https://example.com/img.png)
{width=800 height=600 caption="图片信息" align=center}
```

支持字段：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `width` | number | null | 宽度 px，为 null 时自适应 |
| `height` | number | null | 高度 px |
| `align` | string | center | left / center / right |
| `border` | boolean | true | 是否显示主题边框 |
| `caption` | string | '' | 图片下方标题文字 |

### 3. Asset Registry（浏览器兼容层）

设计文档见 `archive/v3.5.5-history/assets/images/`。核心概念：

```
asset:img_001 → ImageStore → resolve → COS URL
```

当前 v3.7.0 中，Asset Registry 作为浏览器兼容层保留并由 `index.html` 加载，用于 `assetId → URL` 的本地解析。
它不负责图片上传、COS 管理或远程同步。

## Asset ID 规范

```
{prefix}_{timestamp}

示例:
  img_20260715143000   — 通用图片
  cov_20260715143000   — 封面图
  scr_20260715143000   — 截图
  qr_20260715143000    — 二维码
```

前缀建议：
- `img` — 正文插图
- `cov` — 封面图
- `scr` — 软件截图
- `qr` — 二维码
- `ico` — 图标

## PicGo 上传流程

```
截屏 / 本地图片 → PicGo V3 → 腾讯云 COS → 获取 imgUrl
                                    ↓
                            写入 Markdown
                            ![](imgUrl)
```

PicGo 配置：

```json
{
  "picBed": {
    "uploader": "tcyun",
    "tcyun": {
      "secretId": "",
      "secretKey": "",
      "bucket": "your-public-bucket",
      "region": "your-region"
    }
  }
}
```

## 腾讯云 COS 配置

本公开文档不记录个人存储桶名称。请在本地 PicGo 配置中填写自己的桶信息：

```
Bucket: your-public-bucket
Region: your-region
访问: 按个人需求配置
域名: https://example.com/
```

### 目录结构

```
cos://your-public-bucket/
├── path/to/article-image.jpg
├── footer/official-account.png
├── footer/xiaohongshu.png
├── footer/douyin.png
├── footer/bilibili.png
├── Windows.webp             # Windows 平台图
└── Android.webp             # Android 平台图
```

### 命名建议

```
{日期}_{序号}_{描述}.{ext}

示例:
  20260715_001_screenshot.png
  20260715_002_header.jpg
```

## 图片渲染链路

```
Markdown 图片行 → parser.js tokenize → image token
                 → buildAST → IMAGE node (含 assetId)
                 → astToNodes → { type:'image', src, width, height, ... }
                 → enrich-image.js → 补全默认值
                 → ImageComponent.renderNode() → section HTML
```

## 微信兼容要点

- 图片必须使用 `display: block`（避免底部间隙）
- 边框使用 `border-style: dotted`（个人风格）
- 所有容器显式设置 `background: transparent`
- 图片 URL 必须是 HTTPS
- 不建议使用 SVG 直接作为内容图（微信过滤 `<svg>` 标签）
- 外链图片大小建议 < 5MB，过大影响加载速度

## 版本

v3.7.0 — 2026-07-17 已发布
Asset Registry 作为浏览器兼容层保留，用于 `assetId → URL` 本地解析；不负责图片上传、COS 管理或远程同步。
