/**
 * Footer Pipeline — END 结束标记
 * DrawRu v3.5.7
 *
 * 职责：渲染文章末尾的 END 标记（左右虚线 + 中间 END 文字）
 * 从 footer/index.js 的 FooterRenderer_renderEnd 迁移
 */

var FooterEnd = {
    render: function(theme) {
        var t = theme || {};
        var lineColor = (t.getColor && t.getColor('lightBlue')) || 'rgb(175, 207, 238)';

        var leftLine = '<section style="display: inline-block; vertical-align: top; width: 40%; box-sizing: border-box;">' +
            '<section style="position: static; transform-origin: center center; -webkit-transform-origin: center center; -moz-transform-origin: center center; -o-transform-origin: center center; margin-top: 0px; margin-bottom: 0px; box-sizing: border-box;">' +
            '<section style="margin: 14px 0px; position: static; box-sizing: border-box;">' +
            '<section style="border-top: 1px dotted ' + lineColor + '; box-sizing: border-box;">' +
            '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>' +
            '</section></section></section></section>';

        var endText = '<section style="display: inline-block; vertical-align: top; width: 20%; box-sizing: border-box;">' +
            '<section style="text-align: center; color: ' + lineColor + '; font-size: 18px; box-sizing: border-box;">' +
            '<p style="margin: 0px; padding: 0px; box-sizing: border-box;">END</p>' +
            '</section></section>';

        var rightLine = '<section style="display: inline-block; vertical-align: top; width: 40%; box-sizing: border-box;">' +
            '<section style="position: static; transform-origin: center center; -webkit-transform-origin: center center; -moz-transform-origin: center center; -o-transform-origin: center center; margin-top: 0px; margin-bottom: 0px; box-sizing: border-box;">' +
            '<section style="margin: 14px 0px; position: static; box-sizing: border-box;">' +
            '<section style="border-top: 1px dotted ' + lineColor + '; box-sizing: border-box;">' +
            '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>' +
            '</section></section></section></section>';

        return '<section style="position: static; display: flex; flex-flow: row; justify-content: space-between; align-items: center; box-sizing: border-box;">' +
            leftLine + endText + rightLine + '</section>';
    }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = FooterEnd; }
