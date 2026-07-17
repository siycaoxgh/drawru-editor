/**
 * 组件：页脚 (Footer)
 * 
 * 职责：文章末尾的 Footer 区域
 * 
 * 浏览器版本：不使用 require，直接内联渲染函数
 */

const FooterComponent = {
    /**
     * 渲染页脚
     * @param {object} data - 内容数据
     * @param {object} theme - 主题配置
     * @param {object} layouts - 布局层
     * @returns {string} HTML
     */
    render(data, theme, layouts) {
        return FooterRenderer_render(data, theme, layouts);
    }
};
