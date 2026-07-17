/**
 * PicGo Importer — 浏览器兼容版
 * DrawRu v3.5.5-beta Phase 2-C.1
 */

var PicgoImporter = {
    name: 'picgo',
    version: '3.x',

    transform: function(entry, opts) {
        opts = opts || {};
        var ext = (entry.extname || '.png').replace('.', '');
        var formatMap = {
            png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
            gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
            bmp: 'image/bmp', tiff: 'image/tiff'
        };
        var idPrefix = opts.prefix || 'img';
        var timestamp = entry.fileName ? entry.fileName.replace(/\.[^.]+$/, '') : Date.now().toString();

        return {
            assetId:  idPrefix + '_' + timestamp,
            src:      entry.imgUrl || '',
            filename: entry.fileName || '',
            provider: opts.provider || 'picgo',
            created:  new Date().toISOString(),
            width:    entry.width  || null,
            height:   entry.height || null,
            format:   formatMap[ext] || 'image/png',
            size:     null,
            tags:     [],
            variants: {}
        };
    },

    transformBatch: function(entries, opts) {
        if (!Array.isArray(entries)) return [];
        var self = this;
        return entries.map(function(e) { return self.transform(e, opts); });
    }
};
