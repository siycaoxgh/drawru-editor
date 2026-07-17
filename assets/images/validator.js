/**
 * Image Asset Validator — 浏览器兼容版
 * DrawRu v3.5.5-beta Phase 2-C.1
 */

var IMAGE_MIME_TYPES = [
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'image/svg+xml', 'image/bmp', 'image/tiff'
];

var VALID_PROVIDERS = ['picgo', 'manual', 'obsidian', 'cos'];

function isValidAssetId(id) {
    return typeof id === 'string' && id.length > 0 && id.length <= 256 && /^[a-zA-Z0-9_\-.:]+$/.test(id);
}

function isValidFormat(format) {
    if (!format || typeof format !== 'string') return true;
    return IMAGE_MIME_TYPES.indexOf(format.toLowerCase()) >= 0;
}

function isValidSize(size, maxBytes) {
    maxBytes = maxBytes || 50 * 1024 * 1024;
    return size === null || size === undefined || (typeof size === 'number' && size > 0 && size <= maxBytes);
}

function isValidVariants(variants) {
    if (!variants || typeof variants !== 'object' || Array.isArray(variants)) return true;
    var allowed = { thumb: true, medium: true, full: true };
    for (var key in variants) {
        if (variants.hasOwnProperty(key)) {
            if (!allowed[key]) return false;
            if (typeof variants[key] !== 'string') return false;
        }
    }
    return true;
}

function isValidTags(tags) {
    if (tags === undefined || tags === null) return true;
    if (!Array.isArray(tags)) return false;
    for (var i = 0; i < tags.length; i++) {
        if (typeof tags[i] !== 'string') return false;
    }
    return true;
}

function isValidProvider(provider) {
    if (!provider || typeof provider !== 'string') return true;
    return VALID_PROVIDERS.indexOf(provider.toLowerCase()) >= 0;
}

/**
 * 完整校验图片资产
 * @param {object} asset
 * @param {object} [opts] — { maxBytes }
 * @returns {{ valid: boolean, errors: Array<string> }}
 */
function validateImageAsset(asset, opts) {
    var errors = [];
    if (!asset) return { valid: false, errors: ['asset is required'] };

    if (!asset.assetId) {
        errors.push('assetId is required');
    } else if (!isValidAssetId(asset.assetId)) {
        errors.push('invalid assetId: ' + asset.assetId);
    }
    if (!asset.src) errors.push('src is required');
    if (!isValidFormat(asset.format)) errors.push('unsupported format: ' + asset.format);
    if (!isValidSize(asset.size, opts && opts.maxBytes)) errors.push('invalid size: ' + asset.size);
    if (!isValidVariants(asset.variants)) errors.push('invalid variants object');
    if (!isValidTags(asset.tags)) errors.push('tags must be an array of strings');
    if (!isValidProvider(asset.provider)) errors.push('unknown provider: ' + asset.provider);

    return { valid: errors.length === 0, errors: errors };
}
