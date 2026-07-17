/** Article Footer Pipeline: fixed ordering plus shared dividers. */
var ArticleFooter = {
    render: function(theme) {
        var t = theme || {};
        var modules = [];

        function appendModule(html, addDivider) {
            if (!html) return;
            if (addDivider && modules.length && typeof DividerComponent !== 'undefined') {
                modules.push(DividerComponent.render({ type: 'triple' }, t));
            }
            modules.push(html);
        }

        if (typeof FooterEnd !== 'undefined') appendModule(FooterEnd.render(t), false);
        if (typeof FooterCopyright !== 'undefined') appendModule(FooterCopyright.render(t), false);
        if (typeof FooterRecommend !== 'undefined') appendModule(FooterRecommend.render(t), true);
        if (typeof FooterSocial !== 'undefined') appendModule(FooterSocial.render(t), true);
        if (typeof FooterInteraction !== 'undefined') appendModule(FooterInteraction.render(t), true);

        return modules.join('\n');
    },

    // Deprecated compatibility hook. Footer insertion is no longer string-based.
    _insert: function(html, theme) { return html; }
};

if (typeof module !== 'undefined' && module.exports) module.exports = ArticleFooter;
