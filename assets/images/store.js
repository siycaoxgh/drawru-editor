/**
 * Image Asset Store — 浏览器兼容版
 * DrawRu v3.5.5-beta Phase 2-C.1
 *
 * 职责：管理图片资产元数据
 * - 内存 Map（运行时快速查询）
 * - findByAssetId → 返回 src
 * - 兼容旧 Markdown URL
 */

var ImageStore = (function() {
    var _store = (typeof Map !== 'undefined') ? new Map() : {};

    function _set(k, v) { if (_store.set) _store.set(k, v); else _store[k] = v; }
    function _get(k) { return _store.get ? _store.get(k) : _store[k]; }
    function _del(k) { if (_store.delete) _store.delete(k); else delete _store[k]; }
    function _clear() {
        if (_store.clear) { _store.clear(); } else {
            for (var k in _store) { if (_store.hasOwnProperty(k)) delete _store[k]; }
        }
    }
    function _size() {
        return _store.size !== undefined ? _store.size :
            Object.keys(_store).filter(function(k) { return _store.hasOwnProperty(k); }).length;
    }
    function _list() {
        return _store.keys ? Array.from(_store.keys()) :
            Object.keys(_store).filter(function(k) { return _store.hasOwnProperty(k); });
    }

    return {
        add: function(asset) {
            if (!asset || !asset.assetId || !asset.src) return false;
            _set(asset.assetId, {
                assetId:  asset.assetId,
                src:      asset.src,
                filename: asset.filename || '',
                provider: asset.provider || 'manual',
                created:  asset.created  || new Date().toISOString(),
                width:    asset.width    || null,
                height:   asset.height   || null,
                format:   asset.format   || '',
                size:     asset.size     || null,
                tags:     Array.isArray(asset.tags) ? asset.tags.slice() : [],
                variants: asset.variants || {}
            });
            return true;
        },

        get: function(assetId) {
            if (!assetId) return null;
            var a = _get(assetId);
            return a ? Object.assign({}, a, { tags: a.tags ? a.tags.slice() : [] }) : null;
        },

        remove: function(assetId) {
            if (!assetId) return false;
            var existed = _get(assetId) !== undefined;
            _del(assetId);
            return existed;
        },

        findBySrc: function(src) {
            if (!src) return null;
            var list = _list();
            for (var i = 0; i < list.length; i++) {
                var a = _get(list[i]);
                if (a && a.src === src) return Object.assign({}, a);
            }
            return null;
        },

        filterByProvider: function(provider) {
            var results = [];
            var list = _list();
            for (var i = 0; i < list.length; i++) {
                var a = _get(list[i]);
                if (a && a.provider === provider) results.push(Object.assign({}, a));
            }
            return results;
        },

        filterByTag: function(tag) {
            var results = [];
            var list = _list();
            for (var i = 0; i < list.length; i++) {
                var a = _get(list[i]);
                if (a && a.tags && a.tags.indexOf(tag) >= 0) results.push(Object.assign({}, a));
            }
            return results;
        },

        clear: _clear,

        get count() { return _size(); },

        list: _list,

        srcById: function(assetId) {
            var a = this.get(assetId);
            return a ? a.src : null;
        },

        /**
         * 从 registry.json 批量加载资产（v3.5.7 新增）
         * @param {object} registry - { assets: [...] }
         * @returns {number} 加载数量
         */
        loadRegistry: function(registry) {
            if (!registry || !Array.isArray(registry.assets)) return 0;
            _clear();
            var assets = registry.assets;
            var count = 0;
            for (var i = 0; i < assets.length; i++) {
                if (this.add(assets[i])) count++;
            }
            return count;
        }
    };
})();
