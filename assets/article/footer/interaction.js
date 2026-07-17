/** Footer interaction buttons, aligned like the Xiumi reference layout. */
var FooterInteraction = {
    render: function(theme) {
        var t = theme || {};
        var cyan = (t.getColor && t.getColor('cyan')) || 'rgb(68,217,230)';
        var light = (t.getColor && t.getColor('lightBlue')) || 'rgb(175,207,238)';
        var gold = (t.getColor && t.getColor('gold')) || 'rgb(255,189,74)';
        var blue = (t.getColor && t.getColor('blue')) || 'rgb(46,179,255)';
        var textBg = 'rgb(255,255,255)';
        var actions = [
            { text: '点赞', color: cyan },
            { text: '收藏', color: gold },
            { text: '在看', color: blue },
            { text: '留言', color: light }
        ];

        var html = '<section style="margin: 10px 0%; text-align: left; justify-content: flex-start; display: flex; flex-flow: row; position: static; box-sizing: border-box;">' +
            '<section style="display: inline-block; width: 100%; vertical-align: top; margin: 0px; align-self: flex-start; flex: 0 0 auto; box-sizing: border-box;">' +
            '<section style="position: static; transform-origin: right top; margin-top: 0px; margin-bottom: 0px; box-sizing: border-box;">' +
            '<section style="display: flex; flex-flow: row; text-align: right; justify-content: flex-end; margin: 0px 0px -20px; position: static; box-sizing: border-box;">';

        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (i > 0) {
                html += '<section class="group-empty" style="display: inline-block; vertical-align: top; width: 2%; flex: 0 0 auto; height: auto; box-sizing: border-box;">' +
                    '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg></section>';
            }
            html += '<section style="display: inline-block; vertical-align: middle; width: auto; background-color: ' + action.color + '; min-width: 10%; max-width: 100%; flex: 0 0 auto; height: auto; line-height: 1; letter-spacing: 0px; align-self: center; box-sizing: border-box;">' +
                '<section style="text-align: center; justify-content: center; display: flex; flex-flow: row; width: 100%; position: static; box-sizing: border-box;">' +
                '<section style="font-size: 17px; color: ' + textBg + '; padding: 0px 2px; line-height: 1.3; width: 100%; box-sizing: border-box;">' +
                '<p style="margin: 0px; padding: 0px; box-sizing: border-box;">' + action.text + '</p>' +
                '</section></section></section>';
        }

        return html + '</section></section></section></section>';
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = FooterInteraction;
