# DrawRu 编辑器 — v3.7.0

DrawRu 是一个本地微信公众号 Markdown 排版工具：将 Markdown 解析为兼容微信公众号的 HTML，用户确认预览后复制发布。

当前版本：**v3.7.0**

## 当前能力

- ✅ Markdown 解析
- ✅ 微信公众号 HTML 生成
- ✅ COS 图片支持
- ✅ PicGo 工作流
- ✅ Footer 模块 Pipeline
- ✅ software / default 模板系统
- ✅ 一键复制到微信公众号

## 快速开始

```bash
# Windows
start.bat

# macOS / Linux
bash start.sh
```

浏览器打开 `http://localhost:8080/`，选择模板填写内容，点击「应用模板」预览，确认后「复制到剪贴板」粘贴到微信公众号后台。

## 目录结构

```
drawru-editor/
├── index.html                 # 唯一入口（script 加载顺序见文件注释）
├── start.bat / start.sh       # 启动脚本
├── CHANGELOG.md               # 版本记录
│
├── js/                        # 核心脚本
│   ├── parser.js              #   Markdown 解析 → AST → Renderer nodes
│   ├── renderer.js            #   Nodes → 微信公众号 HTML
│   ├── clipboard.js           #   剪贴板复制（iframe 隔离方案）
│   ├── enrich-image.js        #   图片节点增强层
│   ├── template-browser.js    #   模板引擎（software / default）
│   ├── form-browser.js        #   表单引擎（字段映射 + Markdown 生成）
│   ├── theme-manager.js       #   主题管理器
│   └── app.js                 #   主应用（初始化 / 事件 / 渲染调度）
│
├── components/                # UI 组件
│   ├── title.js               #   章节标题（编号 + 双圆点分隔线）
│   ├── paragraph.js           #   段落（Markdown 内联格式）
│   ├── image.js               #   图片（尺寸/对齐/标题/安全过滤）
│   ├── quote.js               #   引用（左侧边线 + 浅蓝背景）
│   ├── info.js                #   信息列表（标签: 值）
│   ├── divider.js             #   分割线（三色头部 + 底部双虚线）
│   ├── footer.js              #   Footer 入口
│   └── assets.js              #   SVG 资源库
│
├── themes/                    # 主题系统
│   ├── default.js             #   默认主题
│   └── software.js            #   软件分享主题
│
├── layouts/core.js            # 布局原语（flex/inlineBlock/section）
├── footer/index.js            # Footer 渲染器（END/Copyright/Social/Follow）
│
├── assets/                    # 静态资源
│   ├── footer/socials.js      #   社交平台矩阵数据
│   ├── images/                #   Asset Registry（浏览器兼容版）
│   │   ├── store.js           #     内存存储
│   │   ├── resolver.js        #     assetId → URL 解析
│   │   ├── validator.js       #     字段校验
│   │   └── importers/picgo.js #     PicGo 格式转换
│   └── article/               #   文章模板模块
│       ├── header-images.*     #     头部图片
│       └── recommend.*         #     推荐文章
│
├── css/style.css              # 编辑器界面样式
├── docs/                      # 规范文档
│   ├── deployment.md          #   部署运行指南
│   ├── image-workflow.md      #   PicGo / COS / 图片渲染链路
│   ├── overview.md            #   架构总览
│   ├── markdown-spec.md       #   Markdown 语法规范
│   ├── rendering-pipeline.md  #   渲染链路
│   └── ...                    #   组件/主题/资源等规范
│
└── reference/                    # 秀米参考文件（archive 不上传正式仓库）
    └── xiumi-original.html       # 秀米参考 HTML
```

## 渲染数据流

```
Markdown 输入
  → parser.js（tokenize → AST → nodes）
  → enrich-image.js（补全图片默认字段 / assetId 解析）
  → renderer.js（renderArticle → 组装 HTML）
  → header-images-renderer（插入头部图片）
  → HeaderImagesRenderer（Header 图片）
  → ArticleFooter.render()（固定 Footer Pipeline）
     → End → Copyright → Recommend → Social → Interaction
  → Preview 预览 / Copy 到剪贴板
```

## 模板系统

当前提供 2 种模板：**软件分享** · **默认文章**。software 模板保持主要模板定位，default 模板用于通用文章排版；tutorial、travel 已暂时归档。

模板数据内联在 `js/template-browser.js` 和 `js/form-browser.js` 中，支持表单填写和 Markdown 编辑两种输入模式。

## 图片系统

| 方式 | 语法 | 说明 |
|---|---|---|
| 标准图片 | `![alt](https://...)` | HTTPS URL，最常用 |
| 图片属性 | `![alt](url)` 下行 `{width=800 caption="..."}` | 可选尺寸/对齐/标题 |
| Asset 协议 | `![alt](asset:img_001)` | Asset Registry 解析 → COS URL（experimental） |

图片必须使用 HTTPS 外链。COS 存储桶：`image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com`

## 微信兼容要点

- 所有元素强制 `background: transparent`
- `<section>` 标签替代 `<div>`
- 图片 `display: block` 消除底部间隙
- SVG Data URI 内联装饰
- iframe + execCommand 复制方案（隔离主页面 CSS）
- ClipboardItem fallback

## 开发约束

### 核心冻结文件

以下文件禁止**架构重构**和**功能扩展**：

`js/parser.js` · `js/renderer.js` · `js/clipboard.js` · `components/image.js` · `footer/index.js`

**允许的修改**：
- 明确 Bug 修复
- 安全修复（XSS、注入等）
- 微信公众号兼容修复
- 所有修改必须记录到 [CHANGELOG.md](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\CHANGELOG.md)

**禁止**：
- 重构核心逻辑
- 改变数据结构接口
- 新增功能特性

### 修改指南

| 需求 | 文件 |
|---|---|
| 改颜色/字体 | `themes/software.js` |
| 新增模板 | `js/template-browser.js` + `js/form-browser.js` |
| 改社交平台 | `assets/footer/socials.js` |
| 改头部图片 | `assets/article/header-images.js` |
| 改推荐内容 | `assets/article/recommend.js` |
| 改界面样式 | `css/style.css` |

## 相关文档

详细规范见 `docs/` 目录：[v3.7 发布说明](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\docs\v3.7-release-notes.md) | [部署指南](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\docs\deployment.md) | [图片流程](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\docs\image-workflow.md) | [架构总览](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\docs\overview.md) | [渲染链路](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\docs\rendering-pipeline.md)

版本历史见 [CHANGELOG.md](C:\Users\TOM\.qclaw-hermes\scripts\wechat-drawru\drawru-editor\CHANGELOG.md)

---

**DrawRu v3.7.0** · 2026-07-17
