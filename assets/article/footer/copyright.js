/**
 * Footer Pipeline — Copyright 版权声明
 * DrawRu v3.5.7
 *
 * 职责：渲染版权声明区域
 * 从 footer/index.js 的 FooterRenderer_renderCopyright 迁移
 */

var FooterCopyright = {
    render: function(theme) {
        var t = theme || {};
        var config = (t.footer && t.footer.copyright) || {};

        return '<section style="position: static; box-sizing: border-box;">' +
            '<section style="position: static; box-sizing: border-box;">' +
            '<p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">' +
            '<span style="color: rgb(150, 150, 150); font-size: 12px; box-sizing: border-box;">' +
            '© ' + (config.year || '') + ' ' + (config.author || '') + ' / ' + (config.type || '') + '声明' +
            '</span></p></section></section>';
    }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = FooterCopyright; }
