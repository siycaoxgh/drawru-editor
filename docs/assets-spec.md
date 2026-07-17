# DrawRu 资源规范文档

> 版本：v3.7.0
> 更新：2026-07-11  
> 状态：Phase 1-C 完成

---

## 1. COS 目录结构

```
drawru-125xxx.cos.ap-guangzhou.myqcloud.com/
├── footer/                    # Footer 资源
│   ├── qr/                   # 二维码图片
│   │   ├── 公众号.png        # 公众号二维码
│   │   ├── 小红书.png         # 小红书二维码
│   │   ├── 抖音.png           # 抖音二维码
│   │   └── 哔哩哔哩.png       # B站二维码
│   │
│   └── avatar/               # 头像图片
│       └── logo.png          # 公众号头像
│
├── article/                   # 文章正文图片
│   ├── software/             # 软件类文章
│   │   └── {article-id}/
│   │       ├── screenshot-01.png
│   │       ├── screenshot-02.png
│   │       └── icon.png
│   │
│   └── tutorial/             # 教程类文章
│       └── {article-id}/
│           └── step-01.png
│
└── decoration/                # 装饰性资源
    ├── badge/                # 徽章
    │   └── original.png      # 原创徽章
    └── background/           # 背景图片
        └── default.png
```

---

## 2. 图片命名规则

### 2.1 Footer 社交图片

| 平台 | 文件名 | 推荐尺寸 | 说明 |
|------|--------|----------|------|
| 公众号 | `gongzhonghao.png` | 300×300px | 二维码或海报 |
| 小红书 | `xiaohongshu.png` | 300×300px | 二维码 |
| 抖音 | `douyin.png` | 300×300px | 二维码 |
| 哔哩哔哩 | `bilibili.png` | 300×300px | 二维码 |

### 2.2 文章正文图片

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 软件截图 | `screenshot-{序号}.{ext}` | `screenshot-01.png` |
| 功能图标 | `icon-{名称}.{ext}` | `icon-download.png` |
| 步骤图 | `step-{序号}.{ext}` | `step-01.jpg` |
| 封面图 | `cover.{ext}` | `cover.png` |

### 2.3 命名规范

- 使用小写字母
- 使用连字符 `-` 分隔单词
- 使用点号 `.` 分隔文件名和扩展名
- 避免使用中文文件名
- 避免使用特殊字符

---

## 3. URL 规范

### 3.1 COS 公开访问 URL

```
https://{bucket}-{appid}.cos.{region}.myqcloud.com/{path}
```

### 3.2 DrawRu COS URL 模板

```
https://drawru-125xxx.cos.ap-guangzhou.myqcloud.com/{path}
```

### 3.3 URL 参数规范

| 参数 | 说明 | 示例 |
|------|------|------|
| 必需参数 | 图片路径 | `footer/qr/gongzhonghao.png` |
| 可选参数 | 图片处理 | `?imageMogr2/quality/80` |

### 3.4 图片处理参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `imageMogr2/thumbnail/300x` | 缩略图 | `?imageMogr2/thumbnail/300x` |
| `imageMogr2/quality/80` | 质量压缩 | `?imageMogr2/quality/80` |
| `imageMogr2/format/png` | 格式转换 | `?imageMogr2/format/png` |

---

## 4. Footer 资源规范

### 4.1 当前状态

```
assets/footer/
├── socials.js        # 社交平台配置
└── socials.json      # 备用配置文档
```

### 4.2 socials.js 配置格式

```javascript
window.DRAW_RU_SOCIALS = [
    {
        name: "公众号",      // 显示名称
        image: "",           // COS URL（待填写）
        url: ""              // 跳转链接（待填写）
    },
    // ...
];
```

### 4.3 图片上传步骤

1. 在各平台获取二维码/头像图片
2. 裁剪为正方形（建议 300×300px）
3. 上传至腾讯云 COS 对应目录
4. 填写 `assets/footer/socials.js` 中的 `image` 字段

### 4.4 COS 目录映射

| 平台 | COS 路径 |
|------|----------|
| 公众号 | `footer/qr/gongzhonghao.png` |
| 小红书 | `footer/qr/xiaohongshu.png` |
| 抖音 | `footer/qr/douyin.png` |
| 哔哩哔哩 | `footer/qr/bilibili.png` |

### 4.5 完整 URL 示例

```javascript
window.DRAW_RU_SOCIALS = [
    {
        name: "公众号",
        image: "https://drawru-125xxx.cos.ap-guangzhou.myqcloud.com/footer/qr/gongzhonghao.png",
        url: "https://mp.weixin.qq.com/s/xxxxx"
    },
    {
        name: "小红书",
        image: "https://drawru-125xxx.cos.ap-guangzhou.myqcloud.com/footer/qr/xiaohongshu.png",
        url: ""
    },
    // ...
];
```

---

## 5. 文章正文图片规范

### 5.1 图片来源

| 来源 | 说明 | 推荐处理 |
|------|------|----------|
| 软件截图 | 自行截图 | 压缩后上传 |
| 官网图片 | 可能有版权 | 谨慎使用 |
| 免版权图片 | Unsplash/Pexels | 检查授权 |
| 用户提供 | 需授权 | 确保版权 |

### 5.2 图片尺寸

| 用途 | 推荐宽度 | 最大宽度 |
|------|----------|----------|
| 封面图 | 1080px | 1080px |
| 文中插图 | 1080px | 1080px |
| 缩略图 | 300px | 300px |

### 5.3 图片格式

| 格式 | 适用场景 | 推荐 |
|------|----------|------|
| PNG | 需要透明背景 | ✅ |
| JPG | 照片、截图 | ✅ |
| WebP | 现代浏览器 | ⏸️ 微信兼容性问题 |

---

## 6. 第三方依赖审计

### 6.1 xiumi-original.html 第三方图片

| CDN | 类型 | 数量 | 状态 |
|-----|------|------|------|
| `img.xiumi.us` | 正文示例图片 | 12 | ⚠️ 待迁移 |
| `mmbiz.qpic.cn` | 微信头像 | 2 | ⚠️ 待迁移 |
| `statics.xiumi.us` | 装饰 GIF | 1 | ⚠️ 已废弃 |

### 6.2 迁移计划

| 资源类型 | 迁移目标 | 优先级 |
|----------|----------|--------|
| 公众号头像 | `footer/avatar/logo.png` | P1 |
| 正文示例图片 | 用户自行上传 | P1 |
| 装饰 GIF | 纯 CSS 替代 | P2 |

### 6.3 已废弃资源

```
statics.xiumi.us/mat/i/fvId/5c9c018fed22a13945d8d2e0cce9ed34_sz-15113.gif
```
- 用途：点赞/分享按钮装饰背景
- 状态：**已废弃**，DrawRu 不使用此装饰
- 行动：**无需迁移**

---

## 7. 资源管理原则

### 7.1 禁止事项

- ❌ 禁止使用第三方不可控 CDN 图片
- ❌ 禁止直接引用其他网站的图片
- ❌ 禁止上传版权不明的图片

### 7.2 推荐实践

- ✅ 所有图片上传至腾讯云 COS
- ✅ 图片命名遵循规范
- ✅ 定期清理无用资源
- ✅ 保留原图备份

### 7.3 资源更新流程

```
1. 准备图片 → 2. 裁剪压缩 → 3. 上传 COS → 4. 更新配置 → 5. 验证显示
```

---

## 8. 附录

### 8.1 COS 配置信息

```
Bucket: drawru-125xxx
Region: ap-guangzhou
APPID: 125xxx
```

### 8.2 相关文件

| 文件 | 说明 |
|------|------|
| `assets/footer/socials.js` | Footer 社交平台配置 |
| `assets/footer/socials.json` | 备用配置参考 |
| `themes/software.js` | 软件主题（含 footer 配置） |
| `themes/default.js` | 默认主题（含 footer 配置） |

### 8.3 更新记录

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-07-11 | v3.5.5-beta | 初始文档创建 |
