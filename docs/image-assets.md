# 图片资产规范

> DrawRu v3.7.0 · Image Assets Specification

## 架构定位

DrawRu 是 Markdown → 微信 HTML 渲染器，**不做上传**。

```
PicGo (上传器)  →  COS (存储层)  →  图片 URL
     ↓                                    ↓
  output.json                    Markdown ![alt](url)
     ↓                                    ↓
PicgoImporter (一次性导入)         parser.js Image Node
     ↓                                    ↓
registry.json (本地缓存)      enrich-image.js 补齐
     ↓                                    ↓
  asset: 语法                     renderNode() → HTML
```

registry.json 仅作为本地缓存加速 assetId 查找，不是唯一数据源。旧 `![alt](url)` 永远兼容。

## Image Node 字段规范

| 字段 | 类型 | 必填 | 来源 |
|------|------|------|------|
| `alt` | string | ✅ | Markdown `![alt]` |
| `src` | string | ✅ | Markdown `(url)` 或 assetId 解析 |
| `width` | number | — | `{width=800}` |
| `height` | number | — | `{height=600}` |
| `align` | string | — | `left` / `center`(默认) / `right` |
| `border` | boolean | — | 默认 `true` |
| `caption` | string | — | `{caption="说明"}` |
| `assetId` | string | — | `asset:img001` 或 PicGo 导入 |
| `format` | string | — | `image/png` 等 |
| `size` | number | — | 文件字节数 |
| `variants` | object | — | `{thumb, medium, full}` |

## Markdown 语法支持

```
// 标准 URL（永远兼容）
![截图](https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg)

// URL + 属性块
![截图](https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg)
{width=800 height=600 border=false caption="系统架构"}

// Asset 协议
![截图](asset:img001)

// Asset + 属性
![截图](asset:img001)
{width=600 align=right}
```

## ImageAssetManager API

```javascript
var mgr = ImageAssetManager;  // assets/images/index.js

// --- Store ---
mgr.store.add({ assetId, src, filename, provider, width, height, format, tags });
mgr.store.get(assetId)      // → asset object or null
mgr.store.remove(assetId)   // → boolean
mgr.store.list()            // → assetId[]
mgr.store.findBySrc(src)
mgr.store.findByFilename(name)
mgr.store.filterByProvider("picgo")
mgr.store.filterByTag("screenshot")
mgr.store.toRegistry()      // → registry JSON object
mgr.store.loadRegistry(obj) // → count

// --- Validator ---
mgr.validate(asset)         // → { valid, errors }
mgr.validateAssetId(id)
mgr.validateFormat("image/png")
mgr.validateSize(1024)

// --- Resolver ---
mgr.resolve({ src }, store)           // → { url, used }
mgr.resolve({ assetId }, store)       // → { url, used, asset }

// --- PicGo Importer（一次性工具）---
mgr.PicgoImporter.transform(picgoEntry)       // → DrawRu asset
mgr.PicgoImporter.transformBatch([entries])   // → DrawRu assets[]
```

## SR: 内容安全过滤

| URL 类型 | 处理 |
|----------|------|
| `https://` | 正常通过 |
| `http://` | 正常通过 |
| `data:image/png` | 正常通过（内联图片） |
| `asset:xxxxx` | parser 分离为 assetId |
| `javascript:` | → `about:blank` |
| `data:text/html` | → `about:blank` |

全部过滤在 `image.js renderNode()` 中执行。
