/**
 * 组件：图片 (Image) — v3.5.5-beta Phase 2-A
 * 
 * 职责：生成图片组件
 * - 图片外层容器
 * - 虚线边框
 * - 可选的尺寸/对齐/标题控制
 * 
 * 布局职责交给 layouts/
 * 样式参数来自 theme/
 * 
 * Phase 2-A 更新：
 * - 新增 renderNode(node, theme) 统一入口
 * - render(alt, src, theme, layouts) 改为委托到 renderNode
 * - renderWithCaption 增加 HTML 转义（XSS 修复）
 * - 支持 width/height/align/border/caption 可选字段
 */

// HTML 转义工具
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const ImageComponent = {
    // ==========================================
    // @deprecated Phase 2-B — 推荐通过 enrichImageNodes + renderNode 路由
    // 保留作为外部 API（模板系统可能通过 ImageComponent.setMeta 设置属性）
    // 节点增强缓存（外层 enrich 写入，render 读取）
    // ==========================================
    _meta: (typeof Map !== 'undefined') ? new Map() : { _fallback: true, _data: {}, get(k) { return this._data[k]; }, set(k, v) { this._data[k] = v; return this; }, clear() { this._data = {}; } },

    /**
     * 注册图片节点增强数据
     * @param {string} src - 图片 URL（作为 key）
     * @param {object} fields - 增强字段 { title, width, height, align, border, caption }
     */
    setMeta(src, fields) {
        if (src && fields) this._meta.set(src, fields);
    },

    /**
     * 清空所有增强数据
     */
    clearMeta() {
        this._meta.clear();
    },

    // ==========================================
    // 渲染方法
    // ==========================================

    /**
     * renderNode — Phase 2-A 统一入口（推荐）
     * 接收完整的 image node，支持所有可选字段
     * 
     * @param {object} node - 图片节点
     *   @param {string}  node.alt     - 图片描述
     *   @param {string}  node.src     - 图片 URL
     *   @param {string}  [node.title]  - 图片 title 属性
     *   @param {number}  [node.width]  - 图片宽度 px（可选）
     *   @param {number}  [node.height] - 图片高度 px（可选）
     *   @param {string}  [node.align]  - 对齐：left | center | right（默认 center）
     *   @param {boolean} [node.border] - 是否显示主题边框（默认 true）
     *   @param {string}  [node.caption]- 图片标题（已转义）
     * @param {object} theme - 主题配置
     * @returns {string} HTML
     */
    renderNode(node, theme) {
        const t = theme;
        const alt = node.alt || '';
        const src = node.src || '';

        // ========== 图片样式 ==========
        let sizeCSS = '';
        let hasCustomWidth = false;
        const requestedWidth = Number(node.width);
        if (Number.isFinite(requestedWidth) && requestedWidth > 0) {
            sizeCSS += `width:${requestedWidth}px;`;
            hasCustomWidth = true;
        }

        // 正文图片按原始比例自适应，不使用固定比例容器或裁剪。
        const displayWidth = hasCustomWidth ? '' : 'width: 100%;';
        const imgStyle = `
            vertical-align: middle;
            max-width: 100%;
            ${displayWidth}
            height: auto;
            display: block;
            background: transparent;
            ${sizeCSS}
        `;

        // 秀米/微信兼容比例元数据。没有源尺寸时保留空值，仍由图片自身
        // 的 width:100% + height:auto 保持自然比例。
        const requestedHeight = Number(node.height);
        const metadataRatio = node.dataRatio || node.ratio ||
            (Number.isFinite(requestedWidth) && requestedWidth > 0 &&
             Number.isFinite(requestedHeight) && requestedHeight > 0
                ? (requestedHeight / requestedWidth).toString()
                : '');
        const metadataWidth = node.dataW || node.originalWidth ||
            (hasCustomWidth ? String(requestedWidth) : '');
        const imageMetadata =
            ` data-ratio="${escapeHtml(metadataRatio)}"` +
            ` data-w="${escapeHtml(metadataWidth)}"` +
            ' _width="100%" data-s="300,640"';

        // RC.1: filter dangerous URL protocols
        // v3.5.5-beta: .toLowerCase() catches lowercase/UPPER/MiXeD case variants.
        // Only data:text/html is blocked; data:image/png, data:image/webp, data:image/svg+xml are allowed.
        var safeSrc = src;
        if (safeSrc && typeof safeSrc === 'string') {
            var lowerSrc = safeSrc.toLowerCase().trim();
            // lowerSrc already normalized via toLowerCase().trim() — catches all case variants.
            if (!/^(https?:\/\/|data:image\/(png|jpeg|gif|webp)(;|,|$))/i.test(lowerSrc)) {
                safeSrc = 'about:blank';
            }
        }

        // 空 src 或 about:blank → 输出占位 SVG
        var finalSrc = escapeHtml(safeSrc);
        var imgHTML;
        if (!finalSrc || finalSrc === 'about:blank') {
            imgHTML = `<img crossorigin="anonymous" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3E${escapeHtml(alt || 'Image')}%3C/text%3E%3C/svg%3E" alt="${escapeHtml(alt)}" style="${imgStyle}" class="raw-image"${imageMetadata}>`;
        } else {
            imgHTML = `<img crossorigin="anonymous" src="${finalSrc}" alt="${escapeHtml(alt)}" style="${imgStyle}" class="raw-image"${imageMetadata}>`;
        }

        // ========== 边框（可选关闭） ==========
        let borderCSS = '';
        if (node.border !== false) {
            const b = t.borders.image;
            const borderColor = t.getColor(b.borderColor);
            borderCSS = `
                border-style: ${b.borderStyle};
                border-width: ${b.borderWidth};
                border-color: ${borderColor};
                border-radius: ${b.borderRadius};
            `;
        }

        // ========== 对齐 ==========
        let alignCSS = 'text-align: center;';
        if (node.align === 'left')  alignCSS = 'text-align: left;';
        if (node.align === 'right') alignCSS = 'text-align: right;';

        // ========== 容器样式 ==========
        // 保留 section 容器、边框和微信兼容结构，不裁剪原始图片比例
        var containerStyle = '\n            ' + alignCSS + '\n            line-height: 0;\n            margin: ' + (t.spacing ? t.spacing.image : '10px 0') + ';\n            ' + borderCSS + '\n            overflow: hidden;\n            box-sizing: border-box;\n        ';
        var innerStyle = 'display: block; width: 100%; max-width: 100%; vertical-align: middle; line-height: 0; box-sizing: border-box;';

        let html = '<section style="' + containerStyle + '">\n            <section style="' + innerStyle + '">\n                ' + imgHTML + '\n            </section>\n        </section>';

        // ========== 图片标题（安全转义） ==========
        if (node.caption && node.caption.trim()) {
            const captionStyle = `
                text-align: center;
                font-size: 14px;
                color: ${t.getColor('text')};
                margin: 8px 0;
                background: transparent;
            `;
            html += `<p style="${captionStyle}">${escapeHtml(node.caption)}</p>`;
        }

        return html;
    },

    /**
     * render — 兼容旧调用，委托到 renderNode
     * 
     * renderer.js 调用此签名：
     *   ImageComponent.render(node.alt, node.src, this.theme, this.layouts)
     * 
     * Phase 2-A：从 _meta 缓存查找增强数据并合并
     * 无缓存时行为与 v3.5.5-beta 完全一致
     * 
     * @param {string} alt - 图片描述
     * @param {string} src - 图片链接
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数（保留兼容，当前未使用）
     * @returns {string} HTML
     */
    render(alt, src, theme, layouts) {
        // 查找增强数据
        const extra = this._meta.get(src) || {};
        return this.renderNode({
            alt: alt || '',
            src: src || '',
            title:   extra.title   || '',
            width:   extra.width   || null,
            height:  extra.height  || null,
            align:   extra.align   || 'center',
            border:  extra.border  !== false,
            caption: extra.caption || ''
        }, theme);
    },

    /**
     * renderWithCaption — 带标题渲染（已修复 XSS）
     * 
     * @param {string} alt - 图片描述
     * @param {string} src - 图片链接
     * @param {string} caption - 图片标题（自动转义）
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    renderWithCaption(alt, src, caption, theme, layouts) {
        if (!caption) {
            return this.render(alt, src, theme, layouts);
        }
        return this.renderNode({
            alt: alt || '',
            src: src || '',
            caption: caption,
            align: 'center',
            border: true
        }, theme);
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageComponent;
}
