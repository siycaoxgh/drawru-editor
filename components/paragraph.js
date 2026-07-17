function escapeHtml(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '#';
    var value = url.trim();
    if (/^(https?:\/\/|mailto:|#)/i.test(value)) return escapeHtml(value);
    if (!/^[a-z][a-z0-9+.-]*:/i.test(value) && !value.startsWith('//')) return escapeHtml(value);
    return '#';
}

function renderInlineMarkdown(text, theme) {
    var source = String(text == null ? '' : text);
    var pattern = /\*\*(.+?)\*\*|\[([^\]]+)]\(([^)]+)\)/g;
    var html = '', lastIndex = 0, match;
    while ((match = pattern.exec(source))) {
        html += escapeHtml(source.slice(lastIndex, match.index));
        if (match[1] !== undefined) {
            html += '<strong style="color: ' + theme.getColor('gold') + '; background: transparent;">' + escapeHtml(match[1]) + '</strong>';
        } else {
            html += '<a href="' + sanitizeUrl(match[3]) + '" style="color: ' + theme.getColor('blue') + '; background: transparent;">' + escapeHtml(match[2]) + '</a>';
        }
        lastIndex = pattern.lastIndex;
    }
    return html + escapeHtml(source.slice(lastIndex));
}

const ParagraphComponent = {
    render(text, theme, layouts) {
        const t = theme;
        const html = renderInlineMarkdown(text, t);
        const styles = {
            'font-size': t.fonts.body.fontSize,
            'line-height': t.fonts.body.lineHeight,
            'color': t.getColor('text'),
            'margin': t.spacing.paragraph,
            'background': 'transparent'
        };
        const styleStr = Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        return `<section style="${styleStr}">${html}</section>`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParagraphComponent;
}
