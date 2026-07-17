# DrawRu v3.7.0 — 部署与运行指南

## 运行方式

### 本地开发

```bash
# Windows
start.bat

# macOS / Linux
bash start.sh
```

启动后在浏览器打开 `http://localhost:8080/`

### 纯静态部署

项目为纯 HTML/CSS/JS，无需构建工具或 Node.js 后端。任意静态文件服务器均可运行：

```bash
python -m http.server 8080
# 或
npx serve .
# 或直接拖拽 index.html 到浏览器（部分功能受限）
```

**注意**：直接打开 `index.html`（file:// 协议）可能导致剪贴板 API 不可用，建议使用 HTTP 服务器。

## 目录结构

```
drawru-editor/
├── index.html                 # 唯一入口
├── start.bat / start.sh       # 启动脚本
├── CHANGELOG.md               # 版本记录
│
├── js/                        # 核心脚本（按加载顺序）
│   ├── parser.js              #   Markdown 解析 → AST → Renderer nodes
│   ├── renderer.js            #   Renderer nodes → HTML 渲染
│   ├── clipboard.js           #   剪贴板复制（iframe 隔离方案）
│   ├── enrich-image.js        #   图片节点增强（assetId → src 解析）
│   ├── template-browser.js    #   模板引擎（4 种模板内联）
│   ├── form-browser.js        #   表单引擎（字段映射 + Markdown 生成）
│   ├── theme-manager.js       #   主题管理器
│   └── app.js                 #   主应用（初始化 / 事件绑定 / 渲染调度）
│
├── components/                # UI 组件（与秀米对齐）
│   ├── title.js               #   章节标题
│   ├── paragraph.js           #   段落（支持 Markdown 内联格式）
│   ├── image.js               #   图片（支持尺寸/对齐/标题属性）
│   ├── quote.js               #   引用
│   ├── info.js                #   信息列表
│   ├── divider.js             #   分割线（三色 / 底部）
│   ├── footer.js              #   Footer 入口（委托到 footer/index.js）
│   ├── interaction.js         #   点赞/分享/在看/留言按钮
│   └── assets.js              #   SVG 资源库
│
├── themes/                    # 主题（颜色/字体/间距/装饰/边框）
│   ├── default.js             #   默认主题
│   └── software.js            #   软件分享主题
│
├── layouts/                   # 布局层
│   └── core.js                #   flex/inline-block/section 等布局原语
│
├── footer/                    # Footer 渲染器
│   └── index.js               #   END / Copyright / Social / Follow 渲染
│
├── assets/                    # 静态资源
│   ├── footer/socials.js      #   社交平台矩阵数据
│   └── article/               #   文章模板模块
│       ├── header-images.js           #   头部图片配置
│       ├── header-images-renderer.js  #   头部图片渲染器
│       ├── recommend.js               #   推荐配置
│       └── recommend-renderer.js      #   推荐渲染器
│
├── css/
│   └── style.css              #   编辑器界面样式
│
├── docs/                      # 文档
│   ├── deployment.md          #   本文件
│   ├── image-workflow.md      #   图片工作流程
│   ├── rendering-pipeline.md  #   渲染管线
│   ├── assets-spec.md         #   资源规范
│   ├── component-spec.md      #   组件规范
│   ├── theme-spec.md          #   主题规范
│   ├── wechat-rule.md         #   微信公众号排版规则
│   └── reports/               #   代码审查报告存档
│
├── archive/v3.5.5.bate-history/ # 已归档的测试/验证脚本
├── reference/                 # 参考素材
│   └── xiumi-original.html    #   秀米原始 HTML
└── archive/                   # 历史版本代码
    ├── v3.5-history/
    └── v3.5.5-history/
```

## 数据流

```
Markdown 输入 → parser.js (tokenize → AST → nodes)
               → enrich-image.js (补全图片默认字段)
               → renderer.js (renderArticle → 组装 HTML)
               → header-images-renderer (插入头部图片)
               → recommend-renderer (插入推荐文章)
               → interaction (插入互动按钮)
               → Preview 显示 / Copy 到剪贴板
```

## 微信公众号发布流程

1. 在 DrawRu 编辑器中填写内容（表单或 Markdown）
2. 点击「应用模板」预览效果
3. 确认无误后点击「复制到剪贴板」
4. 打开微信公众号后台 → 新建图文 → 正文区域粘贴（Ctrl+V）
5. 检查粘贴效果，必要时微调
6. 添加封面图、摘要 → 发布

### 注意事项

- 粘贴时确保使用 Ctrl+V（不要用右键菜单），以保留 HTML 富文本格式
- 秀米编辑器的原生复制行为与 DrawRu 兼容，使用相同的 iframe + execCommand 方案
- 背景透明是微信的要求，所有 section 元素均强制 `background: transparent`
- 图片需使用 HTTPS 外链（已上传至 COS 的 URL）

## 修改指南

| 需求 | 修改位置 |
|---|---|
| 修改颜色/字体 | `themes/software.js` 或 `themes/default.js` |
| 新增模板 | `js/template-browser.js` + `js/form-browser.js` |
| 修改组件样式 | 对应 `components/*.js` 文件 |
| 修改 Footer | `footer/index.js` |
| 修改社交平台链接 | `assets/footer/socials.js` |
| 修改头部图片 | `assets/article/header-images.js` |
| 修改推荐内容 | `assets/article/recommend.js` |
| 修改界面样式 | `css/style.css` |

## 版本

**DrawRu v3.7.0** — 2026-07-17 已发布
