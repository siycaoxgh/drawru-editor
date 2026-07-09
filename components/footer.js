/**
 * 组件：页脚 (Footer)
 * 
 * 职责：渲染页脚区域
 * - header: 头部关注区域
 * - end: END 结束标记
 * 
 * 样式参数来自 theme/
 */

const FooterComponent = {
    /**
     * 渲染页脚
     * @param {object} options - 选项
     * @param {string} options.type - 类型: "header" | "end"
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局函数
     * @returns {string} HTML
     */
    render(options = {}, theme, layouts) {
        const type = options.type || 'header';
        const t = theme || { 
            colors: { text: 'rgb(62, 62, 62)' },
            decorations: { ellipse: { width: '52px', height: '29px' } }
        };
        
        if (type === 'end') {
            return this._renderEnd(t, layouts);
        }
        
        // header - 头部关注区域
        return this._renderHeader(t, layouts);
    },
    
    /**
     * 渲染头部
     */
    _renderHeader(theme, layouts) {
        const t = theme;
        const textColor = t.getColor('text');
        const d = t.decorations.ellipse;
        const width = parseInt(d.width);
        const height = parseInt(d.height);
        const borderColor = t.getColor(d.borderColor);
        const whiteColor = t.getColor('white');
        
        // ========== Layer 1: 椭圆装饰（恢复秀米 rotate(328deg) 旋转）==========
        // 对应秀米: <section class="group-empty" style="... transform: rotate(328deg);">
        const ellipseLayer = `<section style="
            display: inline-block;
            vertical-align: top;
            width: ${d.width};
            height: ${d.height};
            overflow: hidden;
            border-radius: 50%;
            border-width: ${d.borderWidth};
            border-style: ${d.borderStyle};
            border-color: ${borderColor};
            transform: rotate(${d.rotate});
            -webkit-transform: rotate(${d.rotate});
            -moz-transform: rotate(${d.rotate});
            -o-transform: rotate(${d.rotate});
            box-sizing: border-box;
        ">
            <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
        </section>`;
        
        // ========== Layer 2: ✦ 标志（深色模式兼容版）==========
        // 放弃秀米的固定白色背景实现
        // 新方案：✦ 直接显示，无背景覆盖，靠椭圆旋转角度+文字自身形成视觉差异
        // 这样在微信深色模式下不会有突兀的白色色块
        const starOverlay = `<section style="
            text-align: center;
            margin: -10px 0px 0px;
            transform: translate3d(1px, 0px, 0px);
            -webkit-transform: translate3d(1px, 0px, 0px);
            -moz-transform: translate3d(1px, 0px, 0px);
            -o-transform: translate3d(1px, 0px, 0px);
            position: static;
            box-sizing: border-box;
        ">
            <section style="text-align: justify; box-sizing: border-box;">
                <p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
                    <span style="
                        color: ${textColor};
                        box-sizing: border-box;
                        display: inline-block;
                        padding: 0 1px;
                    ">
                        <span style="
                            display: inline-block;
                            transform: rotate(-28deg);
                            -webkit-transform: rotate(-28deg);
                            font-size: 12px;
                            line-height: 1;
                        ">✦</span>
                    </span>
                </p>
            </section>
        </section>`;
        
        // 椭圆 + ✦ 垂直堆叠（使用 flex column）
        const ellipseAndStar = `<section style="
            display: inline-block;
            vertical-align: bottom;
            width: auto;
            min-width: 10%;
            max-width: 100%;
            flex: 0 0 auto;
            height: auto;
            align-self: flex-end;
            box-sizing: border-box;
        ">
            ${ellipseLayer}
            ${starOverlay}
        </section>`;
        
        // ========== Layer 3: 关注文字 ==========
        // 对应秀米: 文字部分带 margin-left: 10px
        const textLayer = `<section style="
            display: inline-block;
            vertical-align: bottom;
            width: auto;
            min-width: 10%;
            max-width: 100%;
            flex: 0 0 auto;
            height: auto;
            align-self: flex-end;
            margin: 0px 0px 0px 10px;
            box-sizing: border-box;
        ">
            <p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">&nbsp; 点击蓝字，关注我们</p>
            <p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">　【DrawRu】分享发现，看见不一样<br style="box-sizing: border-box;"></p>
        </section>`;
        
        // ========== 整体容器（flex row）==========
        return `<section style="
            margin: ${t.spacing.section};
            text-align: left;
            justify-content: flex-start;
            display: flex;
            flex-flow: row;
            position: static;
            box-sizing: border-box;
        ">
            ${ellipseAndStar}
            ${textLayer}
        </section>`;
    },
    
    /**
     * 渲染 END 结束标记
     * 对应秀米 HTML：线-END-线 三段式
     * 使用 flex 布局：40% - 20% - 40%
     */
    _renderEnd(theme, layouts) {
        const t = theme;
        const lightColor = t.getColor('lightBlue');
        const d = t.borders.endLine;
        const lineColor = t.getColor('lightBlue');
        
        // 左虚线段 (40%)
        const leftLine = `<section style="
            flex: 0 0 40%;
            max-width: 40%;
            align-self: center;
        ">
            <section style="
                margin: 14px 0px;
                border-top: ${d.borderWidth} ${d.borderStyle} ${lineColor};
            "></section>
        </section>`;
        
        // END 文字 (20%)
        const endText = `<section style="
            flex: 0 0 20%;
            max-width: 20%;
            align-self: center;
        ">
            <section style="
                text-align: center;
                color: ${lightColor};
                font-size: 18px;
                box-sizing: border-box;
            ">
                <p style="margin: 0px; padding: 0px; box-sizing: border-box;">END</p>
            </section>
        </section>`;
        
        // 右虚线段 (40%)
        const rightLine = `<section style="
            flex: 0 0 40%;
            max-width: 40%;
            align-self: center;
        ">
            <section style="
                margin: 14px 0px;
                border-top: ${d.borderWidth} ${d.borderStyle} ${lineColor};
            "></section>
        </section>`;
        
        return `<section style="
            display: flex;
            flex-flow: row;
            justify-content: center;
            align-items: center;
            position: static;
            box-sizing: border-box;
            text-align: center;
        ">
            ${leftLine}
            ${endText}
            ${rightLine}
        </section>`;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterComponent;
}
