# DrawRu 版本记录

## v3.7.0 — 默认文章模板视觉调整

### 模板
- 保留 `software` 作为当前主要模板，未修改其主题和标题渲染路径
- 恢复 `default` 通用文章模板作为可选模板
- 默认模板章节标题改为“橙色带下划线编号 + 黑色无下划线标题”并排显示
- tutorial、travel 暂时从当前模板选择中移除，历史模板文件保留在 archive
- 修复切换到 `default` 后 Renderer 仍使用 `software` 主题，导致应用模板后视觉无变化的问题

## v3.6.0-rc1 — 2026-07-17 准备发布

### 发布定位
- v3.5.x 微信兼容、图片比例、安全边界和 Footer Pipeline 的收束版本
- 保持本地 Markdown → 微信 HTML → 用户复制发布的产品定位

### 微信兼容
- 正文图片移除固定 16:9、`padding-top`、绝对定位和 `object-fit:cover`，改为自然比例响应式输出
- 推荐卡片改为 `aspect-ratio:16/6`，移除 `padding-top:37.5%`，避免微信保存后产生空白区域
- Divider 统一使用 `DividerComponent.render()` 和零尺寸 SVG 占位符，稳定线条与圆点基线
- 持续使用 `<section>`、`raw-image`、`crossorigin="anonymous"` 和 inline style

### 安全
- 信息、引用、标题和布局文字统一 HTML 转义
- Header、Recommend、Social 和旧 Footer 兼容入口统一过滤图片 URL 协议
- 图片 `width`、`height` 在 `enrich-image.js` 中统一校验

### 架构与归档
- Footer 固定 Pipeline：END → Copyright → Recommend → Social → Interaction
- `.cluster` 测试/验证脚本已归档至 `archive/v3.5.5.bate-history/`
- 保留旧 Footer 入口用于兼容，不删除历史接口

### 已知非阻断事项
- 旧 `InteractionComponent`、`RecommendRenderer` 文件仍由入口加载，但不参与主渲染链路
- 配置面板图片预览白名单比最终渲染器宽，后续统一

## v3.5.7 — 2026-07-16 Bug Fix 批次

### 安全修复
- `parser.js` 图片属性白名单过滤，禁止 `src`/`assetId`/`variants`/`type` 被属性块覆盖
- `parser.js` 属性块正则改为必须含 `=`（`/^\{.+?=.+?\}$/`），避免吞掉普通花括号文本
- `renderer.js` `ListComponent` 先 `escapeHtml` 再做 markdown 格式处理，修复 XSS
- `recommend-renderer.js` 标题 `escapeHtml` + URL `sanitizeUrl` 拦截 `javascript:`/`data:text/html`
- `app.js` `onConfigImageInput` URL 白名单：http/https/data:image，拦截 javascript:/vbscript:/data:text/html

### 功能性修复
- `parser.js` 标题显式编号扩展为 01-99（原仅 01-09）
- `parser.js` `assets/images/store.js` 补充 `loadRegistry(registry)` 方法，修复 registry.json 无法加载
- `TemplateEngine.get()` 返回对象附加 `_file` 字段，修复 `FormEngine` 字段映射全走 `default` 的 BUG

### 微信兼容修复
- `components/divider.js` `_renderTripleDivider` 全部 `<div>` 替换为 `<section>`

### UI / 架构调整
- `index.html` 左侧面板改为「排版设置」：模板卡片选择 + 文章配置面板
- `app.js` 模板切换只改排版模板，不动文章内容；`FormEngine` 降级为文章配置面板
- `css/style.css` 新增模板卡片 grid 布局、配置面板样式、推荐文章组样式
- `app.js` Header Images 回退插入改用深度计数追踪根 `</section>` 位置
- `components/image.js` 16:9 分支清理无效 `.replace()` 自身替换、消除重复 `width:`

### 文档
- `README.md` 冻结文件说明调整：禁止架构重构和功能扩展，允许 Bug/安全/微信兼容修复
- `clipboard.js` 注释修正：主路径为 iframe+execCommand（微信兼容），Clipboard API 为备用

### 代码规范（v3.6 计划）
- 全项目 `var` → `let/const` 统一作为 v3.6 代码规范优化项，不在 v3.5.7 执行

### 无需修改确认
- Theme getter（`DEFAULT_THEME.footer.socials` / `SOFTWARE_THEME.footer.socials`）设计正确，保持现有 getter
- `clipboard.js` 复制逻辑不修改
- 主题文件 (`themes/default.js`, `themes/software.js`) 不修改
- `parser.js` / `renderer.js` 整体结构不改变

---

### 图片增强
- 图片属性扩展 `{width=800 height=600 caption="..." align=center}`
- 图片节点统一入口 `ImageComponent.renderNode(node, theme)`
- 图片增强层 `enrichImageNodes()` 补全默认字段
- HTML 安全转义（XSS 修复）
- 危险 URL 协议过滤（javascript: / data:text/html）
- 空 src 占位 SVG 兜底

### Markdown 图片属性
- `parser.js` 支持行间属性块 `{key=value}`
- `parseImageAttrs()` 类型推断（string/number/boolean）
- 透传属性到渲染器节点

### Asset Registry 设计
- `ImageStore` 内存存储 + registry.json 持久化
- `ImageAssetManager` 统一入口
- `ImageAssetValidator` 完整字段校验
- `PicgoImporter` PicGo V3 输出格式转换
- Asset ID 规范：`{prefix}_{timestamp}`
- **v3.5.5-beta 冻结时归档**，代码移入 archive

### PicGo 流程
- PicGo V3 → 腾讯云 COS 上传链设计
- 输出格式 → DrawRu Registry 转换接口

### COS 流程
- 腾讯云 COS (ap-shanghai) 存储桶配置
- 公有读访问策略
- 图片 URL 命名规范

### 微信兼容
- iframe + execCommand 剪贴板复制（隔离主页面 CSS）
- ClipboardItem fallback
- 所有 section 强制 `background: transparent`
- 图片 `display: block` 消除底部间隙
- SVG Data URI 内联
- HTML 结构对齐

### Footer 资源管理
- Footer 渲染器浏览器版（无 Node.js 依赖）
- END / Copyright / Social / Follow 模块
- 社交平台矩阵数据 `assets/footer/socials.js`
- 主题驱动的颜色和装饰

### 文章模块（Phase 3-Final）
- Header Images 模块（正文前图片插入）
- Recommend 模块（推荐文章卡片）
- Interaction 组件（点赞/分享/在看/留言）
- 模块插入逻辑（基于 HTML 注释定位）

### 代码清理（2026-07-15）
- 删除 `parser.js` 未使用变量 `autoNumberH3`
- 删除 `app.js` 空函数 `onEditorChange()`
- 合并 `components/image.js` 重复注释
- 移除 `js/config.js` 归档到 archive
- `app.js` HTML 字符串插入增加 3 处 safety fallback（TRIPLE_DIVIDER / tail </section> 查找 -1 保护）
- `components/image.js` URL 安全过滤补文档（大小写覆盖 + data:image/... 豁免说明）
- `enrich-image.js` asset: 协议代码标记 EXPERIMENTAL
- `start.sh` 版本号 v3.5.4 → v3.5.5-beta
- 全局 `https://example.com/image.jpg` 替换为真实 COS URL（5 个文件）
- `assets/images/` 浏览器兼容版重建（移除 require/module.exports，全局声明）
- Asset Registry 正式接入 index.html 加载链
- 归档 40 个测试/历史文件到 `archive/tests-history/` 和 `archive/docs-history/v3.5.1/`
- 更新 `README.md` 到 v3.5.5-beta
- 新增 `docs/deployment.md` 部署运行指南
- 新增 `docs/image-workflow.md` 图片工作流程

### 冻结文件
以下文件进入稳定期，禁止新增功能和架构修改：

- `js/parser.js` — Markdown 解析器
- `js/renderer.js` — 渲染器
- `js/clipboard.js` — 剪贴板复制
- `components/image.js` — 图片组件
- `footer/index.js` — Footer 渲染器

---

## v3.5.4 — 2026-07 (摘要)

- 主题系统：default / software 双主题
- 布局层：Layouts 原语（flex / inlineBlock / section）
- 组件拆分：title / paragraph / image / quote / info / divider / footer
- Markdown 解析器 v3：Tokenize → AST → Nodes 三层架构
- 模板引擎：software / tutorial / travel / default 四种模板
- 表单引擎：字段映射 + Markdown 生成
- 剪贴板复制 v3：ClipboardItem 优先，execCommand fallback

---

## v3.5 (摘要)

- 初始组件化架构
- 参考公众号文章精确参数
- 微信公众号排版规则验证
