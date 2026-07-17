/**
 * DrawRu Footer 渲染器（浏览器版） — v3.7.0 兼容入口
 *
 * 职责：Header 渲染（Follow 关注引导），以及为旧调用链提供兼容。
 *
 * v3.7.0 变更：
 * - 尾部渲染（END+Copyright+Social+Recommend+Interaction）已迁移到
 *   assets/article/footer/ Pipeline 统一编排，不再由此文件渲染。
 * - Header 关注引导（renderFollow）保持不变，仍由 renderer.js 调用。
 * - render({ type: 'end' }) 保留兼容，内部逻辑不变。
 *
 * 新架构调用链：
 *   app.js → ArticleFooter.render(theme) → [End, Copyright, Recommend, Social, Interaction]
 *
 * 基于秀米 xiumi-original.html 逐元素迁移
 * 无 Node.js 依赖，可直接在浏览器运行
 */

/**
 * Footer 配置（内联，无 require）
 */
const FooterConfig = {
    name: 'software',
    description: '软件分享类文章 Footer',
    
    // 渲染顺序
    order: [
        'end',
        'copyright',
        'social',
        'follow'
    ],
    
    // 公众号关注数据（独有配置，不在 theme 中）
    follow: {
        followText: '点击蓝字，关注我们',
        accountName: '【DrawRu】分享发现，看见不一样'
    }
};

/**
 * 主渲染函数
 * @param {object} data - 内容数据
 * @param {object} theme - 主题
 * @param {object} layouts - 布局层
 * @returns {string} HTML
 */
function FooterRenderer_render(data, theme, layouts) {
    const type = data && data.type ? data.type : 'end';
    
    // 根据 type 决定渲染哪些模块
    switch (type) {
        case 'header':
            // 顶部：仅渲染 Follow
            return FooterRenderer_renderFollow(data, theme, layouts);
            
        case 'end':
        default:
            // v3.5.6 compatibility: delegate article footer rendering to the
            // fixed-order ArticleFooter pipeline when it is loaded.
            if (typeof ArticleFooter !== 'undefined' && ArticleFooter.render) {
                return ArticleFooter.render(theme);
            }
            // 底部：渲染 End + Copyright + Social（不含 Follow）
            let html = '';
            html += FooterRenderer_renderEnd(data, theme, layouts);
            html += FooterRenderer_renderCopyright(data, theme, layouts);
            html += FooterRenderer_renderSocial(data, theme, layouts);
            return html;
    }
}

/**
 * 渲染 END 结束标记
 */
function FooterRenderer_renderEnd(data, theme, layouts) {
    const t = theme || {};
    const lineColor = (t.getColor && t.getColor('lightBlue')) || 'rgb(175, 207, 238)';
    
    // 左虚线 (40%)
    const leftLine = `<section style="display: inline-block; vertical-align: top; width: 40%; box-sizing: border-box;">
    <section style="position: static; transform-origin: center center; -webkit-transform-origin: center center; -moz-transform-origin: center center; -o-transform-origin: center center; margin-top: 0px; margin-bottom: 0px; box-sizing: border-box;">
        <section style="margin: 14px 0px; position: static; box-sizing: border-box;">
            <section style="border-top: 1px dotted ${lineColor}; box-sizing: border-box;">
                <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
            </section>
        </section>
    </section>
</section>`;
    
    // END 文字 (20%)
    const endText = `<section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;">
    <section style="text-align: center; color: ${lineColor}; font-size: 18px; box-sizing: border-box;">
        <p style="margin: 0px; padding: 0px; box-sizing: border-box;">END</p>
    </section>
</section>`;
    
    // 右虚线 (40%)
    const rightLine = `<section style="display: inline-block; vertical-align: top; width: 40%; box-sizing: border-box;">
    <section style="position: static; transform-origin: center center; -webkit-transform-origin: center center; -moz-transform-origin: center center; -o-transform-origin: center center; margin-top: 0px; margin-bottom: 0px; box-sizing: border-box;">
        <section style="margin: 14px 0px; position: static; box-sizing: border-box;">
            <section style="border-top: 1px dotted ${lineColor}; box-sizing: border-box;">
                <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
            </section>
        </section>
    </section>
</section>`;
    
    // 外层容器：使用 flex 布局确保线-文字-线在同一行
    return `<section style="position: static; display: flex; flex-flow: row; justify-content: space-between; align-items: center; box-sizing: border-box;">
    ${leftLine}
    ${endText}
    ${rightLine}
</section>`;
}

/**
 * 渲染版权声明
 */
function FooterRenderer_renderCopyright(data, theme, layouts) {
    const config = (theme && theme.footer && theme.footer.copyright) || {};
    
    return `<section style="position: static; box-sizing: border-box;">
    <section style="position: static; box-sizing: border-box;">
        <p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
            <span style="color: rgb(150, 150, 150); font-size: 12px; box-sizing: border-box;">
                © ${config.year} ${config.author} / ${config.type}声明
            </span>
        </p>
    </section>
</section>`;
}

/**
 * 渲染社交平台矩阵
 */
function FooterRenderer_renderSocial(data, theme, layouts) {
    const t = theme || {};
    const socials = (t.footer && t.footer.socials) || [];
    const lineColor = (t.getColor && t.getColor('lightBlue')) || 'rgb(175, 207, 238)';
    
    // RC.1: 空数组保护
    if (!socials || !socials.length) return '';

    function escapeFooterHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function sanitizeFooterImageUrl(value) {
        if (!value || typeof value !== 'string') return '';
        const url = value.trim();
        if (!/^(https?:\/\/|data:image\/(png|jpeg|gif|webp)(;|,|$))/i.test(url)) return '';
        return escapeFooterHtml(url);
    }
    
    // 生成单个社交平台卡片
    function createSocialCard(social, index) {
        const borderColor = lineColor;
        const safeName = escapeFooterHtml(social && social.name);
        const safeImage = sanitizeFooterImageUrl(social && social.image);
        
        return `<section style="display: inline-block; vertical-align: top; width: auto; flex: 90 90 0%; height: auto; box-sizing: border-box;">
    <section style="text-align: left; justify-content: flex-start; display: flex; flex-flow: row; position: static; box-sizing: border-box;">
        <section style="display: inline-block; width: 100%; vertical-align: top; align-self: flex-start; flex: 0 0 auto; box-sizing: border-box;">
            <section style="text-align: center; line-height: 0; position: static; box-sizing: border-box;">
                <section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; border-style: dotted; border-width: 2px; border-color: ${borderColor}; border-radius: 10px; overflow: hidden; box-sizing: border-box;">
                    ${safeImage ? `<img class="raw-image" src="${safeImage}" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" data-ratio="1" _width="100%" crossorigin="anonymous">` : ''}
                </section>
            </section>
            <section style="justify-content: flex-start; display: flex; flex-flow: row; margin: -25px 0px 0px; position: static; box-sizing: border-box;">
                <section style="display: inline-block; width: 100%; vertical-align: middle; align-self: center; flex: 0 0 auto; background-color: ${borderColor}; border-bottom: 2px dashed ${borderColor}; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; overflow: hidden; height: auto; padding: 5px; box-sizing: border-box;">
                    <section style="text-align: justify; font-size: 12px; font-family: PangMenZhengDao; box-sizing: border-box;">
                        <p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
                            <strong style="box-sizing: border-box;">
                                <span style="text-align: justify; box-sizing: border-box;">${safeName}</span>
                            </strong>
                        </p>
                    </section>
                </section>
            </section>
        </section>
    </section>
</section>`;
    }
    
    // 生成间隔
    function createGap() {
        return `<section class="group-empty" style="display: inline-block; vertical-align: top; width: 5%; flex: 0 0 auto; height: auto; box-sizing: border-box;">
    <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
</section>`;
    }
    
    // 组装社交平台
    let socialCards = '';
    socials.forEach((social, index) => {
        if (index > 0) {
            socialCards += createGap();
        }
        socialCards += createSocialCard(social, index);
    });
    
    // 生成底部三色分隔线
    function createShortLine() {
        return `<section style="display: inline-block; vertical-align: middle; width: auto; align-self: center; flex: 100 100 0%; height: auto; box-sizing: border-box;">
    <section style="margin: 0.5em 0px; position: static; box-sizing: border-box;">
        <section style="border-top: 1px dashed ${lineColor}; box-sizing: border-box;">
            <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
        </section>
    </section>
</section>`;
    }
    
    function createTripleDot(colorName) {
        let dotColor;
        if (colorName === 'cyan') dotColor = (t.getColor && t.getColor('cyan')) || 'rgb(68, 217, 230)';
        else if (colorName === 'gold') dotColor = (t.getColor && t.getColor('gold')) || 'rgb(255, 189, 74)';
        else dotColor = (t.getColor && t.getColor('blue')) || 'rgb(46, 179, 255)';
        
        return `<section style="display: inline-block; vertical-align: middle; width: auto; align-self: center; flex: 0 0 0%; height: auto; line-height: 0; margin: 0px 10px; box-sizing: border-box;">
    <section style="margin: 0px; position: static; box-sizing: border-box;">
        <section class="group-empty" style="display: inline-block; width: 10px; height: 10px; vertical-align: top; overflow: hidden; background-color: ${dotColor}; border-width: 0px; border-radius: 95px; border-style: none; border-color: rgb(62, 62, 62); box-sizing: border-box;">
            <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
        </section>
    </section>
</section>`;
    }
    
    const tripleDots = createShortLine() + 
        createTripleDot('cyan') + 
        createShortLine() + 
        createTripleDot('gold') + 
        createShortLine() + 
        createTripleDot('blue') + 
        createShortLine();
    
    // 整体结构
    return `<section style="text-align: center; justify-content: center; display: flex; flex-flow: row; margin: 10px 0px; position: static; box-sizing: border-box;">
    ${socialCards}
</section>
<section style="text-align: center; justify-content: center; display: flex; flex-flow: row; margin: 10px 0px; position: static; box-sizing: border-box;">
    ${tripleDots}
</section>`;
}

/**
 * 渲染公众号关注（Header）
 */
function FooterRenderer_renderFollow(data, theme, layouts) {
    const t = theme || {};
    const decorations = t.decorations || {};
    const ellipse = decorations.ellipse || {};
    const config = FooterConfig.follow;
    const textColor = (t.getColor && t.getColor('text')) || 'rgb(62, 62, 62)';
    const borderColor = textColor;
    const whiteColor = 'rgb(255, 255, 255)';
    
    const d = {
        width: ellipse.width || '52px',
        height: ellipse.height || '29px',
        rotate: ellipse.rotate || '328deg'
    };
    
    // 椭圆装饰
    const ellipseLayer = `<section style="display: inline-block; vertical-align: top; width: ${d.width}; height: ${d.height}; overflow: hidden; border-radius: 50%; border-width: 1px; border-style: solid; border-color: ${borderColor}; box-sizing: border-box;">
    <svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>
</section>`;
    
    // 旋转容器
    const rotatedEllipse = `<section style="position: static; transform: rotateZ(${d.rotate}); -webkit-transform: rotateZ(${d.rotate}); -moz-transform: rotateZ(${d.rotate}); -o-transform: rotateZ(${d.rotate}); box-sizing: border-box;">
    <section style="text-align: center; margin: 0px; position: static; box-sizing: border-box;">
        ${ellipseLayer}
    </section>
</section>`;
    
    // ✦ 标志
    const starOverlay = `<section style="text-align: center; margin: -10px 0px 0px; transform: translate3d(1px, 0px, 0px); -webkit-transform: translate3d(1px, 0px, 0px); -moz-transform: translate3d(1px, 0px, 0px); -o-transform: translate3d(1px, 0px, 0px); position: static; box-sizing: border-box;">
    <section style="text-align: justify; box-sizing: border-box;">
        <p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">
            <span style="background-color: ${whiteColor}; box-sizing: border-box;">&nbsp;✦&nbsp;</span>
        </p>
    </section>
</section>`;
    
    // 椭圆 + ✦ 组合
    const ellipseWithStar = `<section style="display: inline-block; vertical-align: bottom; width: auto; min-width: 10%; max-width: 100%; flex: 0 0 auto; height: auto; align-self: flex-end; box-sizing: border-box;">
    ${rotatedEllipse}
    ${starOverlay}
</section>`;
    
    // 关注文字
    const followText = `<section style="display: inline-block; vertical-align: bottom; width: auto; min-width: 10%; max-width: 100%; flex: 0 0 auto; height: auto; align-self: flex-end; margin: 0px 0px 0px 10px; box-sizing: border-box;">
    <section style="text-align: justify; box-sizing: border-box;">
        <p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">&nbsp; ${config.followText}</p>
        <p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">${config.accountName}<br style="box-sizing: border-box;"></p>
    </section>
</section>`;
    
    // 整体容器
    return `<section style="margin: 10px 0px; text-align: left; justify-content: flex-start; display: flex; flex-flow: row; position: static; box-sizing: border-box;">
    ${ellipseWithStar}
    ${followText}
</section>`;
}

/**
 * 导出（兼容浏览器和 Node.js）
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        render: FooterRenderer_render,
        renderEnd: FooterRenderer_renderEnd,
        renderCopyright: FooterRenderer_renderCopyright,
        renderSocial: FooterRenderer_renderSocial,
        renderFollow: FooterRenderer_renderFollow,
        config: FooterConfig
    };
}
