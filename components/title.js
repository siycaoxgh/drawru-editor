/**
 * 组件：章节标题 (Title)
 * 
 * 职责：生成章节标题结构
 * - 章节编号（01-05）
 * - 双圆点分隔线
 * - 小标题文字
 * 
 * 布局职责交给 layouts/
 * 样式参数来自 theme/
 */

const TitleComponent = {
    /**
     * 渲染章节标题
     * @param {string} num - 章节编号，如 "01"
     * @param {string} label - 小标题，如 "【软件概览】"
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(num, label, theme, layouts) {
        const t = theme;
        const L = layouts;
        
        // ========== 1. 章节编号行 ==========
        const numStyles = {
            'font-size': t.fonts.chapterNumber.fontSize,
            'font-weight': t.fonts.chapterNumber.fontWeight,
            'color': t.getColor(t.fonts.chapterNumber.color),
            'text-decoration': t.fonts.chapterNumber.textDecoration,
            'letter-spacing': t.fonts.chapterNumber.letterSpacing,
            'background': 'transparent'
        };
        
        const numHTML = L.span({
            styles: numStyles,
            content: num
        });
        
        // 编号容器（inline-block + vertical-align: bottom）
        const numContainer = L.inlineBlock({
            width: 'auto',
            verticalAlign: 'bottom',
            styles: {
                'min-width': '10%',
                'flex': '0 0 auto',
                'align-self': 'flex-end',
                'padding': '0px 2px'
            },
            content: `<p style="margin: 0px; padding: 0px; box-sizing: border-box;">${numHTML}</p>`
        });
        
        // 装饰空白区（flex: 100 100 0%）
        const decorationArea = L.inlineBlock({
            width: 'auto',
            verticalAlign: 'bottom',
            flex: '100 100 0%',
            alignSelf: 'flex-end',
            content: `<p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><br></p>`
        });
        
        // 章节编号行
        const numRow = L.flexRow({
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            margin: '10px 0% 2px',
            content: numContainer + decorationArea
        });
        
        // ========== 2. 双圆点分隔线 ==========
        const dividerHTML = this._renderSectionDivider(t, L);
        
        // ========== 3. 小标题 ==========
        const subtitleStyles = {
            'font-size': t.fonts.subtitle.fontSize,
            'color': t.getColor(t.fonts.subtitle.color),
            'background': 'transparent'
        };
        
        const subtitleHTML = L.paragraph({
            content: label,
            styles: {
                'text-align': 'left',
                'white-space': 'normal'
            },
            ...subtitleStyles
        });
        
        const subtitleSection = `<section style="box-sizing: border-box;">${subtitleHTML}</section>`;
        
        // ========== 组合 ==========
        return numRow + dividerHTML + subtitleSection;
    },
    
    /**
     * 渲染双圆点分隔线（内部方法）
     * 对应秀米 HTML 中章节标题下的装饰线
     * 使用 flex 布局确保点-线-点 三个元素在同一水平线
     */
    _renderSectionDivider(theme, layouts) {
        const t = theme;
        const L = layouts;
        const d = t.decorations.sectionDots;
        const line = t.decorations.sectionLine;
        const dotColor = t.getColor('lightBlue');
        
        // 外层容器：flex row
        return `<section style="
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: center;
            margin: ${t.spacing.sectionDivider};
            overflow: hidden;
            position: static;
            box-sizing: border-box;
        ">
            <section style="
                display: inline-block;
                width: 6px;
                height: 6px;
                flex: 0 0 6px;
                align-self: center;
            ">
                <section style="
                    transform: rotate(0.1deg);
                    width: 6px;
                    height: 6px;
                    border-radius: 100%;
                    background-color: ${dotColor};
                "></section>
            </section>
            <section style="
                flex: 1 1 0%;
                min-width: 0;
                margin: 0px 6px;
                align-self: center;
                border-bottom: ${line.borderWidth} ${line.borderStyle} ${t.getColor(line.borderColor)};
            "></section>
            <section style="
                display: inline-block;
                width: 6px;
                height: 6px;
                flex: 0 0 6px;
                align-self: center;
                background-color: ${dotColor};
                border-radius: 100%;
            "></section>
        </section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TitleComponent;
}
