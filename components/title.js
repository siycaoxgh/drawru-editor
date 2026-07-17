/** Article section title with the Xiumi chapter divider structure. */
function escapeTitleHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const TitleComponent = {
    render(num, label, theme, layouts) {
        const t = theme;
        const L = layouts;
        const titleConfig = t.components && t.components.title;
        if (titleConfig && titleConfig.layout === 'number-inline') {
            return this._renderInlineTitle(num, label, t, L, titleConfig);
        }
        const numStyles = {
            'font-size': t.fonts.chapterNumber.fontSize,
            'font-weight': t.fonts.chapterNumber.fontWeight,
            'color': t.getColor(t.fonts.chapterNumber.color),
            'text-decoration': t.fonts.chapterNumber.textDecoration,
            'letter-spacing': t.fonts.chapterNumber.letterSpacing,
            'background': 'transparent'
        };
        const numHTML = L.span({ styles: numStyles, content: escapeTitleHtml(num) });
        const numContainer = L.inlineBlock({
            width: 'auto',
            verticalAlign: 'bottom',
            styles: { 'min-width': '10%', 'flex': '0 0 auto', 'align-self': 'flex-end', 'padding': '0px 2px' },
            content: `<p style="margin: 0px; padding: 0px; box-sizing: border-box;">${numHTML}</p>`
        });
        const decorationArea = L.inlineBlock({
            width: 'auto',
            verticalAlign: 'bottom',
            flex: '100 100 0%',
            alignSelf: 'flex-end',
            content: '<p style="white-space: normal; margin: 0px; padding: 0px; box-sizing: border-box;"><br></p>'
        });
        const numRow = L.flexRow({
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            margin: '10px 0% 2px',
            content: numContainer + decorationArea
        });
        const dividerHTML = this._renderSectionDivider(t);
        const subtitleStyles = {
            'font-size': t.fonts.subtitle.fontSize,
            'color': t.getColor(t.fonts.subtitle.color),
            'background': 'transparent',
            'text-align': 'left',
            'white-space': 'normal'
        };
        const subtitleHTML = L.paragraph({ content: label, styles: subtitleStyles });
        return numRow + dividerHTML + '<section style="box-sizing: border-box;">' + subtitleHTML + '</section>';
    },

    _renderInlineTitle(num, label, theme, layouts, config) {
        const t = theme;
        const L = layouts;
        const numberStyles = {
            'font-size': t.fonts.chapterNumber.fontSize,
            'font-weight': t.fonts.chapterNumber.fontWeight,
            'color': t.getColor(t.fonts.chapterNumber.color),
            'text-decoration': t.fonts.chapterNumber.textDecoration,
            'letter-spacing': t.fonts.chapterNumber.letterSpacing,
            'background': 'transparent'
        };
        const numberHTML = L.span({ styles: numberStyles, content: escapeTitleHtml(num) });
        const text = String(label == null ? '' : label).replace(/^【|】$/g, '');
        const labelHTML = L.span({
            styles: {
                'font-size': config.labelFontSize || t.fonts.subtitle.fontSize,
                'color': t.getColor(config.labelColor || 'text'),
                'text-decoration': config.labelTextDecoration || 'none',
                'white-space': 'normal'
            },
            content: escapeTitleHtml(text)
        });
        const numberPart = L.inlineBlock({
            verticalAlign: 'baseline',
            styles: { 'flex': '0 0 auto', 'padding': '0px' },
            content: numberHTML
        });
        const labelPart = L.inlineBlock({
            verticalAlign: 'baseline',
            styles: { 'flex': '0 1 auto', 'margin': '0px 0px 0px ' + (config.gap || '10px') },
            content: labelHTML
        });
        const titleRow = L.flexRow({
            alignItems: 'baseline',
            margin: config.margin || '10px 0px 8px',
            content: numberPart + labelPart
        });
        // default 仅调整标题排布，章节与正文之间继续复用 software 的现有点线点 Divider。
        return titleRow + this._renderSectionDivider(t);
    },

    _renderSectionDivider(theme) {
        const t = theme;
        const color = t.getColor('lightBlue');
        const spacer = '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>';
        const dot = '<section style="width: 6px; height: 6px; border-radius: 100%; background-color: ' + color + '; box-sizing: border-box;">' + spacer + '</section>';
        const leftDot = '<section style="display: inline-block; vertical-align: middle; width: 6px; height: 6px; box-sizing: border-box;"><section style="transform: rotate(0.1deg); -webkit-transform: rotate(0.1deg); -moz-transform: rotate(0.1deg); -o-transform: rotate(0.1deg); box-sizing: border-box;">' + dot + '</section></section>';
        const line = '<section style="display: inline-block; vertical-align: middle; width: 100%; margin: 0px -6px 0px -7px; border-bottom: 2px dotted ' + color + '; box-sizing: border-box;">' + spacer + '</section>';
        const rightDot = '<section style="display: inline-block; vertical-align: middle; width: 6px; height: 6px; border-radius: 100%; background-color: ' + color + '; box-sizing: border-box;">' + spacer + '</section>';
        return '<section style="margin: 0.5em 0px; overflow: hidden; position: static; box-sizing: border-box;">' + leftDot + line + rightDot + '</section>';
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = TitleComponent;
