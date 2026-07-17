/**
 * Footer Pipeline — Social 社交平台矩阵
 * DrawRu v3.5.7
 *
 * 职责：渲染社交平台卡片（公众号/小红书/抖音/B站）
 * 数据来源：window.DRAW_RU_SOCIALS（assets/footer/socials.js）
 * 内容从 footer/index.js 的 FooterRenderer_renderSocial 迁移
 *
 * 若无社交数据，返回空字符串
 */

var FooterSocial = {
    render: function(theme) {
        var t = theme || {};
        var socials = (t.footer && t.footer.socials) || [];
        var lineColor = (t.getColor && t.getColor('lightBlue')) || 'rgb(175, 207, 238)';

        if (!socials || !socials.length) return '';

        function escapeHtml(value) {
            return String(value == null ? '' : value)
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function sanitizeImageUrl(value) {
            if (!value || typeof value !== 'string') return '';
            var url = value.trim();
            return /^(https?:\/\/|data:image\/(png|jpeg|gif|webp)(;|,|$))/i.test(url) ? escapeHtml(url) : '';
        }

        function createSocialCard(social) {
            return '<section style="display: inline-block; vertical-align: top; width: auto; flex: 90 90 0%; height: auto; box-sizing: border-box;">' +
                '<section style="text-align: left; justify-content: flex-start; display: flex; flex-flow: row; position: static; box-sizing: border-box;">' +
                '<section style="display: inline-block; width: 100%; vertical-align: top; align-self: flex-start; flex: 0 0 auto; box-sizing: border-box;">' +
                '<section style="text-align: center; line-height: 0; position: static; box-sizing: border-box;">' +
                '<section style="max-width: 100%; vertical-align: middle; display: inline-block; line-height: 0; border-style: dotted; border-width: 2px; border-color: ' + lineColor + '; border-radius: 10px; overflow: hidden; box-sizing: border-box;">' +
                (sanitizeImageUrl(social.image) ? '<img class="raw-image" src="' + sanitizeImageUrl(social.image) + '" style="vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;" data-ratio="1" _width="100%" crossorigin="anonymous">' : '') +
                '</section></section>' +
                '<section style="justify-content: flex-start; display: flex; flex-flow: row; margin: -25px 0px 0px; position: static; box-sizing: border-box;">' +
                '<section style="display: inline-block; width: 100%; vertical-align: middle; align-self: center; flex: 0 0 auto; background-color: ' + lineColor + '; border-bottom: 2px dashed ' + lineColor + '; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; overflow: hidden; height: auto; padding: 5px; box-sizing: border-box;">' +
                '<section style="text-align: justify; font-size: 12px; font-family: PangMenZhengDao; box-sizing: border-box;">' +
                '<p style="text-align: center; white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;">' +
                '<strong style="box-sizing: border-box;"><span style="text-align: justify; box-sizing: border-box;">' + escapeHtml(social.name) + '</span></strong>' +
                '</p></section></section></section></section></section></section>';
        }

        function createGap() {
            return '<section class="group-empty" style="display: inline-block; vertical-align: top; width: 5%; flex: 0 0 auto; height: auto; box-sizing: border-box;">' +
                '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg></section>';
        }

        var intro = '<section style="margin: 20px 0px 6px; text-align: center; box-sizing: border-box;">' +
            '<p style="margin: 0px; padding: 0px; color: ' + lineColor + '; font-size: 13px; letter-spacing: 2px;">//欢迎前来做客//</p>' +
            '</section>' +
            '<section style="margin: 0px 0px 12px; text-align: center; box-sizing: border-box;">' +
            '<p style="margin: 0px; padding: 0px; color: rgb(62,62,62); font-size: 14px;">你可以在以下平台找到我们</p>' +
            '</section>';

        // 组装社交卡片
        var socialCards = '';
        for (var i = 0; i < socials.length; i++) {
            if (i > 0) socialCards += createGap();
            socialCards += createSocialCard(socials[i]);
        }

        return intro + '<section style="text-align: center; justify-content: center; display: flex; flex-flow: row; margin: 10px 0px; position: static; box-sizing: border-box;">' +
            socialCards + '</section>';
    }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = FooterSocial; }
