/**
 * 模块：渲染器
 * 负责将 Markdown 节点转换为微信公众号 HTML
 * 
 * v3.5.1 更新：
 * - 组件统一接收 theme + layouts 参数
 */

// 组件依赖（通过全局变量引用）
// - THEME (themes/default.js)
// - CONFIG (js/config.js)
// - Layouts (layouts/core.js)
// - TitleComponent (components/title.js)
// - ParagraphComponent (components/paragraph.js)
// - ImageComponent (components/image.js)
// - QuoteComponent (components/quote.js)
// - InfoComponent (components/info.js)
// - DividerComponent (components/divider.js)
// - FooterComponent (components/footer.js)

/**
 * 列表组件
 */
const ListComponent = {
    /**
     * 渲染列表项
     * @param {string} index - 编号
     * @param {string} text - 内容
     * @param {object} theme - 主题
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(index, text, theme, layouts) {
        let html = text;
        html = html.replace(/\*\*(.+?)\*\*/g, (match, content) => {
            return `<strong style="color: ${theme.getColor('gold')}; background: transparent;">${content}</strong>`;
        });
        
        const style = `
            margin: 0px 0px 16px;
            color: ${theme.getColor('text')};
            line-height: 1.6;
            background: transparent;
            box-sizing: border-box;
        `;
        
        return `<section style="${style}">
            <strong style="color: ${theme.getColor('gold')}; background: transparent;">${index}.</strong> ${html}
        </section>`;
    }
};

/**
 * 渲染器主类
 */
class MarkdownRenderer {
    constructor(theme, layouts) {
        this.theme = theme || THEME;
        this.layouts = layouts || {};
    }
    
    /**
     * 渲染节点数组为 HTML
     * @param {Array} nodes - 节点数组
     * @returns {string} HTML
     */
    renderNodes(nodes) {
        let html = '';
        
        for (const node of nodes) {
            switch (node.type) {
                case 'title':
                    html += TitleComponent.render(node.num, node.label, this.theme, this.layouts);
                    break;
                case 'subtitle':
                    html += ParagraphComponent.render(node.text, this.theme, this.layouts);
                    break;
                case 'image':
                    html += ImageComponent.render(node.alt, node.src, this.theme, this.layouts);
                    break;
                case 'info':
                    html += InfoComponent.render(node.label, node.value, this.theme, this.layouts);
                    break;
                case 'list':
                    html += ListComponent.render(node.index, node.text, this.theme, this.layouts);
                    break;
                case 'quote':
                    html += QuoteComponent.render(node.text, this.theme, this.layouts);
                    break;
                case 'paragraph':
                    html += ParagraphComponent.render(node.text, this.theme, this.layouts);
                    break;
            }
        }
        
        return html;
    }
    
    /**
     * 渲染完整文章（包含头部、分割线、尾部）
     * @param {Array} nodes - 节点数组
     * @returns {string} HTML
     */
    renderArticle(nodes) {
        let html = '';
        
        // 根容器
        html += `<section style="
            background-color: transparent !important;
            padding: 0px;
            box-sizing: border-box;
            font-style: normal;
            font-weight: 400;
            text-align: justify;
            font-size: 16px;
            color: ${this.theme.getColor('text')};
        ">`;
        
        // 头部
        html += FooterComponent.render({ type: 'header', theme: this.theme }, this.theme, this.layouts);
        
        // 顶部分割线
        html += DividerComponent.render({ type: 'triple' }, this.theme, this.layouts);
        
        // 内容
        html += this.renderNodes(nodes);
        
        // 底部分割线
        html += DividerComponent.render({ type: 'bottom' }, this.theme, this.layouts);
        
        // END
        html += FooterComponent.render({ type: 'end' }, this.theme, this.layouts);
        
        // 关闭根容器
        html += `</section>`;
        
        // 全局 div → section 替换
        html = html.replace(/<div/gi, '<section').replace(/<\/div>/gi, '</section>');
        
        return html;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarkdownRenderer, ListComponent };
}
