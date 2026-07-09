/**
 * 组件：段落
 */

const ParagraphComponent = {
    /**
     * 渲染普通段落
     * @param {string} text - 文本内容
     * @param {object} theme - 主题
     * @returns {string} HTML
     */
    render(text, theme) {
        // 处理 Markdown 格式
        let html = text;
        html = html.replace(/\*\*(.+?)\*\*/g, `<strong style="color: ${theme.colors.gold};">$1</strong>`);
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" style="color: ${theme.colors.blue};">$1</a>`);
        
        return `<section style="${CONFIG.styles.sectionBase}">${html}</section>`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParagraphComponent;
}
