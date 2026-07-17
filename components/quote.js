/**
 * 组件：引用 (Quote)
 * 
 * 职责：渲染引用段落
 * - 左侧边线
 * - 浅蓝背景色
 * 
 * 样式参数来自 theme/
 * 
 * v3.5.5-beta: 移除 'background': 'transparent'（与 background-color 冲突）
 */

function escapeQuoteHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const QuoteComponent = {
    /**
     * 渲染引用段落
     * @param {string} text - 引用文本
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(text, theme, layouts) {
        const t = theme;
        const lightColor = t.getColor('lightBlue');
        const textColor = t.getColor('text');
        
        // 引用样式（单一来源，不冲突）
        const styles = {
            'margin': '10px 0',
            'padding': '12px 16px',
            'background-color': 'rgba(175, 207, 238, 0.13)',  // 浅蓝 8% 透明度
            'border-left': `3px solid ${lightColor}`,
            'color': textColor,
            'line-height': '1.7',
            'box-sizing': 'border-box'
        };
        
        const styleStr = Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        
        return `<section style="${styleStr}">${escapeQuoteHtml(text)}</section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuoteComponent;
}
