/**
 * 组件：信息列表 (Info)
 * 
 * 职责：渲染信息列表项
 * - 软件名称、软件大小、软件版本等
 * - 标签 + 值的形式
 * 
 * 样式参数来自 theme/
 */

function escapeInfoHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const InfoComponent = {
    /**
     * 渲染信息列表项
     * @param {string} label - 标签，如 "软件名称："
     * @param {string} value - 值，如 "TrafficMonitor"
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(label, value, theme, layouts) {
        const t = theme;
        const textColor = t.getColor('text');
        
        // 标签样式
        const labelStyle = `
            color: #666;
            width: 90px;
            flex-shrink: 0;
            background: transparent;
        `;
        
        // 值样式
        const valueStyle = `
            color: ${textColor};
            font-weight: 500;
            background: transparent;
        `;
        
        // 行样式
        const rowStyle = `
            display: flex;
            margin-bottom: 16px;
            font-size: 15px;
            line-height: 1.6;
            background: transparent;
        `;
        
        return `<section style="${rowStyle}">
            <span style="${labelStyle}">${escapeInfoHtml(label)}</span>
            <span style="${valueStyle}">${escapeInfoHtml(value)}</span>
        </section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoComponent;
}
