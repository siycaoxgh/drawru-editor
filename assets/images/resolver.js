/**
 * Image Asset Resolver — 浏览器兼容版
 * DrawRu v3.5.5-beta Phase 2-C.1
 *
 * 职责：
 * 1. assetId → src 查找（通过 ImageStore）
 * 2. 旧 Markdown URL 直接透传
 * 3. variants 变体选择
 */

/**
 * 解析图片 URL
 * 优先级：assetId（store 查找）→ src（直接使用）→ fallback
 */
function resolveImageAsset(input, store, opts) {
    opts = opts || {};

    if (typeof input === 'string') {
        return { url: input || '', used: 'raw-string', asset: null };
    }
    if (!input) return { url: '', used: 'none', asset: null };

    var variant = opts.variant || 'full';
    var asset = null;

    // Priority 1: assetId → store lookup
    if (input.assetId && store) {
        asset = store.get(input.assetId);
        if (asset) {
            if (asset.variants && asset.variants[variant]) {
                return { url: asset.variants[variant], used: 'store-variant:' + variant, asset: asset };
            }
            return { url: asset.src, used: 'store-src', asset: asset };
        }
    }

    // Priority 2: variants on input directly
    if (input.variants && input.variants[variant]) {
        return { url: input.variants[variant], used: 'direct-variant:' + variant, asset: null };
    }

    // Priority 3: src
    if (input.src) {
        return { url: input.src, used: 'src', asset: null };
    }

    if (opts.fallback) {
        return { url: opts.fallback, used: 'fallback', asset: null };
    }

    return { url: '', used: 'none', asset: null };
}

function resolveFromStore(store, assetId, opts) {
    if (!store || !assetId) return { url: '', asset: null, used: 'none' };
    return resolveImageAsset({ assetId: assetId }, store, opts);
}

function resolvePicgoPath(picgoPath) {
    if (!picgoPath || typeof picgoPath !== 'string') return '';
    return picgoPath;
}
