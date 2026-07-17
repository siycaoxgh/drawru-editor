# 发布规范

> DrawRu v3.7.5 · Release Guidelines

## 发布流程

```
Phase N → 功能实现 → 单元测试 → 稳定性验收 → RC → 修复 → Release
```

### 各阶段职责

| 阶段 | 内容 | 交付物 |
|------|------|--------|
| Phase N | 功能实现 | 代码 + 测试脚本 |
| 稳定性验收 | 回归测试 / 安全审计 / 架构审查 | 审计报告 |
| RC | Bug 修复（仅 Blocking + Recommended） | 修复清单 |
| Release | CHANGELOG + 文档更新 | 新版本号 |

## 发布前检查清单

### 代码质量
- [ ] 所有 JS 文件语法正确（`node -e "require(...)"`）
- [ ] 无 U+FFFD 替换字符
- [ ] 无孤立的未引用文件
- [ ] HTML 标签平衡（div/script/section）

### 功能验证
- [ ] 旧 Markdown 语法 100% 兼容
- [ ] 新语法正常渲染
- [ ] 图片渲染（src / width / align / caption）
- [ ] 微信复制完整链路

### 微信兼容
- [ ] 无 `<div>` 标签
- [ ] `background: transparent` 全覆盖
- [ ] 无 `javascript:` / `data:text/html` URL
- [ ] 无灰色背景（微信编辑器粘贴后）

### 安全
- [ ] XSS（caption / alt / src）已防御
- [ ] URL 协议过滤生效
- [ ] HTML 实体正确转义

### 文档
- [ ] CHANGELOG 更新
- [ ] docs/ 文档集与代码一致
- [ ] `docs/v3.7-release-notes.md` 与代码、CHANGELOG 保持一致

## 版本历史

| 版本 | 日期 | 状态 | 主要变更 |
|------|------|------|---------|
| v3.5.4 | 2026-07-09 | Stable | Footer System |
| v3.5.5-alpha | 2026-07-10 | Dev | Markdown Parser v3 |
| v3.5.5-beta | 2026-07-11 | RC | Phase 2-A~C 全部功能 |
| v3.6.0-rc1 | 2026-07-17 | RC | 微信兼容、安全边界、图片比例和 Footer Pipeline 收束 |
| v3.7.5 | 2026-07-17 | Stable | 默认文章模板视觉调整、旧兼容脚本归档和文档收尾 |

## Known Limitations

1. **不支持行内图片** — `![img](url)` 必须独占一行
2. **不支持引用式图片** — `![alt][ref]` 语法不支持
3. **不支持嵌套 HTML** — 所有 HTML 标签会被当作文本
4. **PicGo Importer 为一次性工具** — 不参与运行时渲染流程
5. **registry.json 为本地缓存** — 不是唯一数据源，删除不影响渲染
6. **不支持 RTL 文字** — 仅 LTR 布局
