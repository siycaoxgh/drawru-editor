/**
 * Header 图片渲染器。
 * Header 图片保持原始比例，但复用 DrawRu 图片容器与统一 Divider。
 */
var HeaderImagesRenderer = {
    render: function(images, theme) {
        if (!images || !images.length) return '';
        var hasContent = images.some(function(img) { return sanitizeImageUrl(img.src); });
        if (!hasContent) return '';

        var t = theme || {};
        var html = '';
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var safeSrc = sanitizeImageUrl(img.src);
            if (!safeSrc) continue;

            var border = (t.borders && t.borders.image) || {};
            var borderColor = (t.getColor && t.getColor(border.borderColor)) || 'rgb(175, 207, 238)';
            var margin = (t.spacing && t.spacing.image) || '10px 0';
            html += '<section style="display:block;width:100%;text-align:center;line-height:0;margin:' + margin + ';border:' + (border.borderWidth || '2px') + ' ' + (border.borderStyle || 'dotted') + ' ' + borderColor + ';border-radius:' + (border.borderRadius || '10px') + ';overflow:hidden;box-sizing:border-box;background:transparent;">';
            html += '<section style="display:block;width:100%;max-width:100%;vertical-align:middle;line-height:0;box-sizing:border-box;">';
            html += '<img crossorigin="anonymous" src="' + safeSrc + '" alt="' + escapeHtml(img.alt || '') + '" style="max-width:100%;width:auto;height:auto;margin:0 auto;display:block;background:transparent;" class="raw-image">';
            html += '</section></section>';
        }

        if (typeof DividerComponent !== 'undefined') {
            html += '\n' + DividerComponent.render({ type: 'triple' }, t);
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderImagesRenderer;
}
