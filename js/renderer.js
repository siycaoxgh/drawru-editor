/**
 * 模块：渲染器
 * 负责将 Markdown 节点转换为微信公众号 HTML
 * 
 * v3.5.1 更新：
 * - 组件统一接收 theme + layouts 参数
 */

// 组件依赖（通过全局变量引用）
// - THEME (themes/default.js, themes/software.js)
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
        // v3.5.7: 先转义后处理 markdown 格式，避免 XSS
        var html = escapeHtml(text);
        html = html.replace(/\*\*(.+?)\*\*/g, function(match, content) {
            return '<strong style="color: ' + theme.getColor('gold') + '; background: transparent;">' + content + '</strong>';
        });
        
        var style = 'margin: 0px 0px 16px; color: ' + theme.getColor('text') + '; line-height: 1.6; background: transparent; box-sizing: border-box;';
        
        return '<section style="' + style + '">\n            <strong style="color: ' + theme.getColor('gold') + '; background: transparent;">' + index + '.</strong> ' + html + '\n        </section>';
    }
};

/**
 * 渲染器主类
 */
class MarkdownRenderer {
    constructor(theme, layouts) {
        // 优先使用传入的主题，否则使用全局 ThemeManager
        // v3.5.6: null/undefined theme 时回退到 SOFTWARE_THEME（始终存在）
        this.theme = theme || (window.AppTheme ? window.AppTheme.get() : (typeof SOFTWARE_THEME !== 'undefined' ? SOFTWARE_THEME : null));
        this.layouts = layouts || (typeof Layouts !== 'undefined' ? Layouts : {});
        
        // 如果主题仍然为空，记录警告
        if (!this.theme) {
            console.warn('[MarkdownRenderer] Warning: No theme available');
        }
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
                    html += ImageComponent.renderNode(node, this.theme);
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
        html += '<!-- TRIPLE_DIVIDER -->';
        
        // 内容
        html += this.renderNodes(nodes);
        
        // 底部分割线
        // v3.5.7: 尾部由 ArticleFooter Pipeline 统一编排
        // 固定顺序: End → Copyright → Recommend → Social → Interaction
        html += DividerComponent.render({ type: 'triple' }, this.theme, this.layouts);
        html += ArticleFooter.render(this.theme);
        
        // 关闭根容器
        html += `</section>`;
        
        return html;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarkdownRenderer, ListComponent };
}
