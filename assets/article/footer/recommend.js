/**
 * Footer Pipeline — Recommend 推荐文章
 * DrawRu v3.5.7
 *
 * 职责：渲染"看看其他文章"模块
 * 数据来源：window.DRAW_RU_RECOMMENDS（assets/article/recommend.js）
 * 内容从 assets/article/recommend-renderer.js 的 RecommendRenderer 迁移
 *
 * 支持：标题、图片COS链接、URL（可选）
 * 若无有效推荐数据，返回空字符串
 */

var FooterRecommend = {
    render: function(theme) {
        if (typeof DRAW_RU_RECOMMENDS === 'undefined') return '';

        var items = DRAW_RU_RECOMMENDS;
        if (!items || !items.length) return '';

        var valid = items.filter(function(r) {
            return r.title && sanitizeImageUrl(r.image);
        }).slice(0, 4);
        if (!valid.length) return '';

        var t = theme || {};
        var lc = (t.getColor && t.getColor('lightBlue')) || 'rgb(175,207,238)';
        var tc = (t.getColor && t.getColor('text')) || 'rgb(62,62,62)';
        var html = '';

        // Section header
        html += '<section style="margin: 20px 0 10px; text-align: center; box-sizing: border-box; background: transparent;">' +
            '<p style="margin: 0; padding: 0; font-size: 13px; color: ' + lc + '; letter-spacing: 2px; background: transparent;">//看看其他文章//</p>' +
            '</section>';
        // Subtitle
        html += '<section style="margin: 8px 0 10px; text-align: center; box-sizing: border-box; background: transparent;">' +
            '<p style="margin: 0; padding: 0; font-size: 14px; color: ' + tc + '; background: transparent;">相信我们会有不少共同话题</p>' +
            '</section>';

        for (var r = 0; r < valid.length; r++) {
            var item = valid[r];
            var cardHTML = '';
            var safeImage = sanitizeImageUrl(item.image);
            cardHTML += '<section style="display: inline-block; width: 100%; vertical-align: top; border-style: solid; border-width: 1px; border-color: ' + lc + '; border-radius: 8px; overflow: hidden; box-sizing: border-box; background: transparent;">';
            // Image
            cardHTML += '<section style="width:100%;aspect-ratio:16/6;line-height:0;overflow:hidden;box-sizing:border-box;background:transparent;">';
            cardHTML += '<img crossorigin="anonymous" src="' + safeImage + '" style="width:100%;height:100%;object-fit:cover;display:block;background:transparent;" class="raw-image">';
            cardHTML += '</section>';
            // Title
            cardHTML += '<section style="padding: 8px; text-align: center; box-sizing: border-box; background-color: rgb(175,207,238);">';
            cardHTML += '<p style="margin: 0; padding: 0; font-size: 14px; color: ' + tc + '; line-height: 1.5; background-color: rgb(175,207,238);">' + escapeHtml(item.title) + '</p>';
            cardHTML += '</section></section>';

            if (item.url && item.url.trim()) {
                var safeUrl = sanitizeUrl(item.url.trim());
                html += '<section style="margin: 8px 0; text-align: center; box-sizing: border-box; background: transparent;"><a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">' + cardHTML + '</a></section>';
            } else {
                html += '<section style="margin: 8px 0; text-align: center; box-sizing: border-box; background: transparent;">' + cardHTML + '</section>';
            }
        }
        return html;
    }
};

function sanitizeImageUrl(value) {
    if (!value || typeof value !== 'string') return '';
    var url = value.trim();
    if (!/^(https?:\/\/|data:image\/(png|jpeg|gif|webp)(;|,|$))/i.test(url)) return '';
    return escapeHtml(url);
}

// v3.5.7: sanitizeUrl 内联（与 recommend-renderer.js 一致）
function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    var value = url.trim();
    if (!/^(https?:\/\/|mailto:|#)/i.test(value) && (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//'))) return '#';
    return escapeHtml(value);
}

if (typeof module !== 'undefined' && module.exports) { module.exports = FooterRecommend; }
