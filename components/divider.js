/**
 * 组件：分割线 (Divider)
 * 
 * 职责：生成分割线结构
 * - 三色分隔线（头部装饰）
 * - 底部双虚线
 * 
 * 布局职责交给 layouts/
 * 样式参数来自 theme/
 */

const DividerComponent = {
    /**
     * 渲染分割线
     * @param {object} options - 选项
     * @param {string} options.type - 类型: "triple" | "bottom"
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(options = {}, theme, layouts) {
        const type = options.type || 'triple';
        
        if (type === 'bottom') {
            return this._renderBottomDivider(theme, layouts);
        }
        
        // 默认 triple - 三色分隔线
        return this._renderTripleDivider(theme, layouts);
    },
    
    /**
     * 渲染三色分隔线
     * 对应秀米 HTML：虚线 + 圆点 + 虚线 + 圆点 + 虚线 + 圆点 + 虚线
     */
    _renderTripleDivider(theme, layouts) {
        const t = theme;
        const L = layouts;
        const line = t.decorations.tripleLine;
        const dot = t.decorations.tripleDots;
        const lineColor = t.getColor('lightBlue');
        
        // 单条虚线
        const createLine = () => `<div style="
            margin: 0.5em 0px;
            border-top: ${line.borderWidth} ${line.borderStyle} ${lineColor};
        "></div>`;
        
        // 单个圆点
        const createDot = (colorName) => {
            const color = t.getColor(colorName);
            return `<div style="
                width: ${dot.size};
                height: ${dot.size};
                background-color: ${color};
                border-radius: ${dot.borderRadius};
            "></div>`;
        };
        
        const line1 = createLine();
        const line2 = createLine();
        const line3 = createLine();
        const line4 = createLine();
        
        const dotCyan = createDot('cyan');
        const dotGold = createDot('gold');
        const dotBlue = createDot('blue');
        
        // 外层 flex 容器
        return `<div style="
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            margin: 10px 0px;
            position: static;
            box-sizing: border-box;
        ">
            <div style="flex: 100 100 0%;">${line1}</div>
            <div style="margin: 0px 10px; line-height: 0;">${dotCyan}</div>
            <div style="flex: 100 100 0%;">${line2}</div>
            <div style="margin: 0px 10px; line-height: 0;">${dotGold}</div>
            <div style="flex: 100 100 0%;">${line3}</div>
            <div style="margin: 0px 10px; line-height: 0;">${dotBlue}</div>
            <div style="flex: 100 100 0%;">${line4}</div>
        </div>`;
    },
    
    /**
     * 渲染底部双虚线
     * 对应秀米 HTML：线-点-线-点-线-点-线 共7个元素
     * 使用 flex 布局确保所有元素在同一水平线
     */
    _renderBottomDivider(theme, layouts) {
        const t = theme;
        const L = layouts;
        const lineColor = t.getColor('lightBlue');
        
        // 短虚线（使用 border-top）
        const createShortLine = () => `<section style="
            border-top: 1px dashed ${lineColor};
            margin: 0.5em 0px;
            flex: 1 1 0%;
            min-width: 0;
        "></section>`;
        
        // 小圆点
        const createSmallDot = (colorName) => {
            const color = t.getColor(colorName);
            return `<section style="
                width: 6px;
                height: 6px;
                background-color: ${color};
                border-radius: 100%;
                flex: 0 0 6px;
                align-self: center;
            "></section>`;
        };
        
        const line1 = createShortLine();
        const line2 = createShortLine();
        const line3 = createShortLine();
        const line4 = createShortLine();
        
        const dotCyan = createSmallDot('cyan');
        const dotGold = createSmallDot('gold');
        const dotBlue = createSmallDot('blue');
        
        // 7 段结构: line - dot - line - dot - line - dot - line
        return `<section style="
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
            position: static;
            box-sizing: border-box;
        ">
            ${line1}
            ${dotCyan}
            ${line2}
            ${dotGold}
            ${line3}
            ${dotBlue}
            ${line4}
        </section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DividerComponent;
}
