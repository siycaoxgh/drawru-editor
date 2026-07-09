/**
 * 组件：引用 (Quote)
 * 
 * 职责：渲染引用段落
 * - 左侧边线
 * - 背景色
 * 
 * 样式参数来自 theme/
 */

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
        
        // 引用样式
        const styles = {
            'margin': '10px 0',
            'padding': '12px 16px',
            'background-color': 'rgba(175, 207, 238, 0.13)',  // 浅蓝 8% 透明度
            'border-left': `3px solid ${lightColor}`,
            'color': textColor,
            'line-height': '1.7',
            'box-sizing': 'border-box',
            'background': 'transparent'
        };
        
        const styleStr = Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        
        return `<section style="${styleStr}">${text}</section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuoteComponent;
}
