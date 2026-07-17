/**
 * Image Asset Manager — 浏览器兼容版 入口
 * DrawRu v3.5.5-beta Phase 2-C.1
 *
 * 模块：
 * - store.js      → ImageStore（内存存储）
 * - validator.js   → validateImageAsset / isValidXxx
 * - resolver.js    → resolveImageAsset / resolveFromStore
 * - importers/picgo.js → PicgoImporter
 *
 * 所有模块均为纯浏览器兼容（无 require/module.exports 依赖）。
 * 加载顺序：store.js → validator.js → resolver.js → importers/picgo.js → index.js
 *
 * 使用：
 *   ImageAssetManager.store.add({ assetId:'img001', src:'https://...' });
 *   var r = ImageAssetManager.resolve({ assetId:'img001' }, ImageAssetManager.store);
 *   // r.url → 'https://...'
 */

// ================================================================
// 启动检测：验证所有依赖模块是否已加载
// v3.5.6: 防止加载顺序错误导致静默失效
// ================================================================
(function() {
    var deps = [
        { name: 'ImageStore',          src: 'assets/images/store.js' },
        { name: 'validateImageAsset',  src: 'assets/images/validator.js' },
        { name: 'resolveImageAsset',   src: 'assets/images/resolver.js' },
        { name: 'PicgoImporter',       src: 'assets/images/importers/picgo.js' }
    ];
    var missing = [];
    for (var d = 0; d < deps.length; d++) {
        if (typeof window[deps[d].name] === 'undefined') {
            missing.push(deps[d].name + ' (' + deps[d].src + ')');
        }
    }
    if (missing.length > 0) {
        console.error('[ImageAssetManager] ERROR: ' + missing.length + ' dependency not loaded:');
        for (var m = 0; m < missing.length; m++) {
            console.error('  - ' + missing[m]);
        }
        console.error('[ImageAssetManager] asset: protocol unavailable — image src resolution DISABLED');
        // 不创建 ImageAssetManager，后续 typeof guard 会安全降级
        return;
    }
    console.log('[ImageAssetManager] All dependencies loaded (' + deps.length + '/' + deps.length + ')');

    // ================================================================
    // 创建 ImageAssetManager
    // ================================================================
    var ImageAssetManager = {
        // Store
        store: ImageStore,

        // Validator
        validate:       validateImageAsset,
        validateAssetId: isValidAssetId,
        validateFormat:  isValidFormat,
        validateSize:    isValidSize,
        validateVariants:isValidVariants,
        validateTags:    isValidTags,
        validateProvider:isValidProvider,
        MIME_TYPES:      IMAGE_MIME_TYPES,
        PROVIDERS:       VALID_PROVIDERS,

        // Resolver
        resolve:          resolveImageAsset,
        resolveFromStore: resolveFromStore,
        resolvePicgoPath: resolvePicgoPath,

        // Importer (interface only, no upload)
        PicgoImporter: PicgoImporter
    };

    // 导出为全局变量
    window.ImageAssetManager = ImageAssetManager;

    // ================================================================
    // v3.5.6: 启动时从 registry.json 加载持久化资产
    // 加载失败不影响运行时（静默 fallback，内存 store 仍然可用）
    // ================================================================
    var registryUrl = 'assets/images/registry.json';
    try {
        fetch(registryUrl)
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function(registry) {
                var count = ImageStore.loadRegistry(registry);
                if (count > 0) {
                    console.log('[ImageAssetManager] Registry loaded: ' + count + ' assets from ' + registryUrl);
                } else {
                    console.log('[ImageAssetManager] Registry loaded: 0 assets (registry empty or invalid)');
                }
            })
            .catch(function(err) {
                // 文件不存在、网络错误等情况 — 不影响运行
                console.warn('[ImageAssetManager] Registry not loaded (' + registryUrl + '): ' + err.message + ' — using memory store only');
            });
    } catch (e) {
        console.warn('[ImageAssetManager] fetch not available — using memory store only');
    }
})();
