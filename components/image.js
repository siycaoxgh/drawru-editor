/**
 * 组件：图片 (Image)
 * 
 * 职责：生成图片组件
 * - 图片外层容器
 * - 虚线边框
 * 
 * 布局职责交给 layouts/
 * 样式参数来自 theme/
 */

const ImageComponent = {
    /**
     * 渲染图片
     * @param {string} alt - 图片描述
     * @param {string} src - 图片链接
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(alt, src, theme, layouts) {
        const t = theme;
        const b = t.borders.image;
        const borderColor = t.getColor(b.borderColor);
        
        // 图片样式
        const imgStyle = `
            vertical-align: middle;
            max-width: 100%;
            width: 100%;
            display: block;
            background: transparent;
        `;
        
        // 图片 HTML
        const imgHTML = `<img src="${src}" alt="${alt}" style="${imgStyle}" class="raw-image">`;
        
        // 边框容器（对应秀米的 section > section）
        const containerStyle = `
            text-align: center;
            line-height: 0;
            margin: ${t.spacing.image};
            border-style: ${b.borderStyle};
            border-width: ${b.borderWidth};
            border-color: ${borderColor};
            border-radius: ${b.borderRadius};
            overflow: hidden;
            box-sizing: border-box;
        `;
        
        return `<section style="${containerStyle}">
            <section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; box-sizing: border-box;">
                ${imgHTML}
            </section>
        </section>`;
    },
    
    /**
     * 渲染图片（带标题）
     * @param {string} alt - 图片描述
     * @param {string} src - 图片链接
     * @param {string} caption - 图片标题（可选）
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    renderWithCaption(alt, src, caption, theme, layouts) {
        const imageHTML = this.render(alt, src, theme, layouts);
        
        if (!caption) {
            return imageHTML;
        }
        
        // 标题样式
        const captionStyle = `
            text-align: center;
            font-size: 14px;
            color: ${theme.getColor('text')};
            margin: 8px 0;
            background: transparent;
        `;
        
        return imageHTML + `<p style="${captionStyle}">${caption}</p>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageComponent;
}
