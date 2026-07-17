/**
 * Shared Xiumi Divider.
 * This intentionally follows the original section/inline-block structure,
 * including the zero-size SVG spacer used by WeChat-compatible markup.
 */
const DividerComponent = {
    render(options = {}, theme, layouts) {
        return this._renderTripleDivider(theme);
    },

    _renderTripleDivider(theme) {
        const t = theme;
        const lineColor = t.getColor('lightBlue');
        const line = (t.decorations && t.decorations.tripleLine) || {};
        const dot = (t.decorations && t.decorations.tripleDots) || {};
        const lineStyle = line.borderStyle || 'dashed';
        const lineWidth = line.borderWidth || '1px';
        const dotSize = dot.size || '10px';
        const dotRadius = dot.borderRadius || '95px';
        const spacer = '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>';

        const createLine = () =>
            '<section style="display: inline-block; vertical-align: middle; width: auto; align-self: center; flex: 100 100 0%; height: auto; box-sizing: border-box;">' +
                '<section style="margin: 0.5em 0px; position: static; box-sizing: border-box;">' +
                    '<section style="border-top: ' + lineWidth + ' ' + lineStyle + ' ' + lineColor + '; box-sizing: border-box;">' +
                        spacer +
                    '</section>' +
                '</section>' +
            '</section>';

        const createDot = (colorName) =>
            '<section style="display: inline-block; vertical-align: middle; width: auto; align-self: center; flex: 0 0 0%; height: auto; line-height: 0; margin: 0px 10px; box-sizing: border-box;">' +
                '<section style="margin: 0px; position: static; box-sizing: border-box;">' +
                    '<section class="group-empty" style="display: inline-block; width: ' + dotSize + '; height: ' + dotSize + '; vertical-align: top; overflow: hidden; background-color: ' + t.getColor(colorName) + '; border-width: 0px; border-radius: ' + dotRadius + '; border-style: none; border-color: rgb(62, 62, 62); box-sizing: border-box;">' +
                        spacer +
                    '</section>' +
                '</section>' +
            '</section>';

        return '<section style="text-align: center; justify-content: center; display: flex; flex-flow: row; margin: 10px 0px; position: static; box-sizing: border-box;">' +
            createLine() + createDot('cyan') +
            createLine() + createDot('gold') +
            createLine() + createDot('blue') +
            createLine() +
        '</section>';
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = DividerComponent;
