/**
 * SVG 资源生成器
 * 
 * 职责：根据 theme 参数动态生成 SVG
 * 不再使用硬编码的颜色和尺寸
 */

const SVGGenerator = {
    /**
     * 生成椭圆装饰 SVG
     * @param {object} theme - 主题
     * @returns {string} SVG Data URI
     */
    ellipse(theme) {
        const d = theme.decorations.ellipse;
        const borderColor = theme.getColor(d.borderColor);
        
        // URL 编码 SVG
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${d.width}' height='${d.height}'>
            <ellipse cx='${parseInt(d.width)/2}' cy='${parseInt(d.height)/2}' 
                     rx='${parseInt(d.width)/2 - 1}' ry='${parseInt(d.height)/2 - 1}' 
                     fill='none' 
                     stroke='${borderColor}' 
                     stroke-width='${d.borderWidth}'/>
        </svg>`;
        
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    },
    
    /**
     * 生成虚线 SVG
     * @param {object} theme - 主题
     * @param {string} width - 宽度，如 '80px'
     * @param {string} colorName - 颜色名，如 'lightBlue'
     * @returns {string} SVG Data URI
     */
    dash(theme, width = '80px', colorName = 'lightBlue') {
        const color = theme.getColor(colorName);
        const w = parseInt(width);
        
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='2'>
            <line x1='0' y1='1' x2='${w}' y2='1' 
                  stroke='${color}' 
                  stroke-width='2' 
                  stroke-dasharray='4,3'/>
        </svg>`;
        
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    },
    
    /**
     * 生成圆点 SVG
     * @param {object} theme - 主题
     * @param {string} colorName - 颜色名
     * @param {string} size - 尺寸，如 '10px'
     * @returns {string} SVG Data URI
     */
    dot(theme, colorName = 'cyan', size = '10px') {
        const color = theme.getColor(colorName);
        const s = parseInt(size);
        const r = s / 2;
        
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'>
            <circle cx='${r}' cy='${r}' r='${r}' fill='${color}'/>
        </svg>`;
        
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    },
    
    /**
     * 生成实心圆（用于三色分隔线）
     * @param {object} theme - 主题
     * @param {string} colorName - 颜色名
     * @returns {string} HTML (使用 div 而非 SVG)
     */
    solidDot(theme, colorName) {
        const color = theme.getColor(colorName);
        const d = theme.decorations.tripleDots;
        
        return `<div style="
            display: inline-block;
            width: ${d.size};
            height: ${d.size};
            background-color: ${color};
            border-radius: ${d.borderRadius};
            flex: 0 0 auto;
        "></div>`;
    },
    
    /**
     * 生成三色分隔线（圆点+虚线组合）
     * @param {object} theme - 主题
     * @returns {string} HTML
     */
    tripleDivider(theme) {
        const lineColor = theme.getColor('lightBlue');
        const d = theme.decorations.tripleLine;
        
        // 虚线 HTML（使用 border-top）
        const lineHTML = `<div style="
            margin: 0.5em 0px;
            border-top: ${d.borderWidth} ${d.borderStyle} ${lineColor};
            flex: 100 100 0%;
        "></div>`;
        
        // 圆点
        const cyanDot = this.solidDot(theme, 'cyan');
        const goldDot = this.solidDot(theme, 'gold');
        const blueDot = this.solidDot(theme, 'blue');
        
        return `
        <div style="
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            margin: 10px 0px;
            text-align: center;
        ">
            <div style="flex: 100 100 0%;">${lineHTML}</div>
            <div style="margin: 0px 10px; line-height: 0;">${cyanDot}</div>
            <div style="flex: 100 100 0%;">${lineHTML}</div>
            <div style="margin: 0px 10px; line-height: 0;">${goldDot}</div>
            <div style="flex: 100 100 0%;">${lineHTML}</div>
            <div style="margin: 0px 10px; line-height: 0;">${blueDot}</div>
            <div style="flex: 100 100 0%;">${lineHTML}</div>
        </div>`;
    },
    
    /**
     * 生成双圆点分隔线（用于章节标题下方）
     * @param {object} theme - 主题
     * @returns {string} HTML
     */
    sectionDivider(theme) {
        const d = theme.decorations.sectionLine;
        const dotColor = theme.getColor('lightBlue');
        
        return `
        <div style="
            display: inline-block;
            vertical-align: middle;
            width: 6px;
            height: 6px;
        ">
            <div style="
                transform: rotate(0.1deg);
                width: 6px;
                height: 6px;
                border-radius: 100%;
                background-color: ${dotColor};
            "></div>
        </div>
        <div style="
            display: inline-block;
            vertical-align: middle;
            width: 100%;
            margin: 0px -6px 0px -7px;
            border-bottom: ${d.borderWidth} ${d.borderStyle} ${theme.getColor('lightBlue')};
        "></div>
        <div style="
            display: inline-block;
            vertical-align: middle;
            width: 6px;
            height: 6px;
            border-radius: 100%;
            background-color: ${dotColor};
        "></div>`;
    },
    
    /**
     * 生成 END 区域虚线
     * @param {object} theme - 主题
     * @param {string} widthPercent - 宽度百分比
     * @returns {string} HTML
     */
    endLine(theme, widthPercent = '40%') {
        const d = theme.borders.endLine;
        const color = theme.getColor('lightBlue');
        
        return `
        <div style="
            display: inline-block;
            vertical-align: top;
            width: ${widthPercent};
        ">
            <div style="
                margin: 14px 0px;
                border-top: ${d.borderWidth} ${d.borderStyle} ${color};
            "></div>
        </div>`;
    },
    
    /**
     * 生成图片边框容器
     * @param {object} theme - 主题
     * @param {string} imageHTML - img HTML
     * @returns {string} HTML
     */
    imageWrapper(theme, imageHTML) {
        const b = theme.borders.image;
        const color = theme.getColor(b.borderColor);
        
        return `
        <div style="
            text-align: center;
            line-height: 0;
            margin: 10px 0px;
            border-style: ${b.borderStyle};
            border-width: ${b.borderWidth};
            border-color: ${color};
            border-radius: ${b.borderRadius};
            overflow: hidden;
        ">
            ${imageHTML}
        </div>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGGenerator;
}
