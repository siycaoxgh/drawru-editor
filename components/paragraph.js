/**
 * 组件：段落 (Paragraph)
 * 
 * 职责：渲染普通段落
 * - 处理 Markdown 格式（**加粗**、链接）
 * - 段落间距
 * 
 * 布局职责交给 layouts/
 * 样式参数来自 theme/
 */

const ParagraphComponent = {
    /**
     * 渲染普通段落
     * @param {string} text - 文本内容
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(text, theme, layouts) {
        const t = theme;
        
        // 处理 Markdown 格式
        let html = text;
        
        // **加粗** → <strong>
        html = html.replace(/\*\*(.+?)\*\*/g, (match, content) => {
            return `<strong style="color: ${t.getColor('gold')}; background: transparent;">${content}</strong>`;
        });
        
        // [链接](url) → <a>
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, (match, text, url) => {
            return `<a href="${url}" style="color: ${t.getColor('blue')}; background: transparent;">${text}</a>`;
        });
        
        // 段落样式
        const styles = {
            'font-size': t.fonts.body.fontSize,
            'line-height': t.fonts.body.lineHeight,
            'color': t.getColor('text'),
            'margin': t.spacing.paragraph,
            'background': 'transparent'
        };
        
        const styleStr = Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        
        return `<section style="${styleStr}">${html}</section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParagraphComponent;
}
