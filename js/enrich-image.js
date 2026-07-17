/**
 * DrawRu v3.5.5-beta Phase 2-A
 * 图片节点增强层 — enrichImageNodes
 * 
 * 运行位置：parseMarkdown() → enrichImageNodes() → renderer.renderNodes()
 * 修改限制：不修改 parser.js / renderer.js / clipboard.js / footer/index.js
 * 
 * 用法（在 app.js 的 applyTemplate 中）：
 *   const nodes = parseMarkdown(editor.value);
 *   const enriched = enrichImageNodes(nodes);
 *   const html = renderer.renderNodes(enriched);
 */

/**
 * 增强图片节点 — 为 image 节点补全可选字段
 * 不修改传入的 nodes 数组，返回新的浅拷贝数组
 * 
 * @param {Array<object>} nodes - parseMarkdown 返回的节点数组
 * @returns {Array<object>} 增强后的节点数组
 */
function enrichImageNodes(nodes) {
    if (!Array.isArray(nodes)) return [];
    
    return nodes.map(function(node) {
        // 非图片节点直接透传
        if (node.type !== 'image') return node;
        
        // 浅拷贝，避免污染原始数据
        var enriched = Object.assign({}, node);
        
        // ========== 应用默认值（所有新增字段必须可选） ==========
        
        // title — 默认为空
        if (enriched.title === undefined) {
            enriched.title = '';
        }
        
        // width/height — 默认为 null（不限制尺寸）
        enriched.width = normalizeImageDimension(enriched.width);
        enriched.height = normalizeImageDimension(enriched.height);
        
        // align — 默认居中
        if (enriched.align === undefined) {
            enriched.align = 'center';
        }
        
        // border — 默认显示
        if (enriched.border === undefined) {
            enriched.border = true;
        }
        
        // caption — 默认为空
        if (enriched.caption === undefined) {
            enriched.caption = '';
        }
        
        // ========== Phase 2-C.2: assetId → registry → src (EXPERIMENTAL) ==========
        // v3.6: Asset Registry 作为浏览器兼容层保留，负责 assetId → URL 本地解析。
        // typeof guard 确保 Registry 不可用时不影响普通 Markdown 图片。
        if (enriched.assetId && !enriched.src) {
            try {
                if (typeof ImageAssetManager !== 'undefined' && ImageAssetManager.store) {
                    var resolved_asset = ImageAssetManager.resolve({ assetId: enriched.assetId }, ImageAssetManager.store);
                    if (resolved_asset && resolved_asset.url) {
                        enriched.src = resolved_asset.url;
                    }
                }
            } catch (e) {
                // registry 不可用时静默 fallback — asset: 协议 unavailable
            }
        }

                // ========== Phase 2-B1.5: Asset 协议字段 ==========
        if (enriched.assetId === undefined) {
            enriched.assetId = "";
        }
        if (enriched.format === undefined) {
            enriched.format = "";
        }
        if (enriched.size === undefined) {
            enriched.size = null;
        }
        if (enriched.variants === undefined) {
            enriched.variants = {};
        } else if (enriched.variants === null) {
            enriched.variants = {};
        }
        
        // ========== 智能推断（可选） ==========
        // 如果 alt 文本像是一个短标题（不含 URL），可自动作为 caption
        // 但这种推断容易误判，Phase 2-A 不做，留给后期
        
        return enriched;
    });
}

/**
 * 将图片尺寸收敛为正数；非法、负数、NaN 和无穷值统一禁用。
 * 这是进入 HTML/CSS 渲染前的最后一道边界。
 */
function normalizeImageDimension(value) {
    if (value === null || value === undefined || value === '') return null;
    var number = typeof value === 'number' ? value : Number(String(value).trim());
    return Number.isFinite(number) && number > 0 ? number : null;
}

/**
 * 为指定 URL 的图片节点设置增强字段（批量）
 * 用于用户通过表单/image-picker 等其他入口设置的元数据
 * 
 * @param {Array<object>} nodes - 节点数组
 * @param {object} overrides - { "url": { width, height, ... }, ... }
 * @returns {Array<object>} 节点数组
 */
function applyImageOverrides(nodes, overrides) {
    if (!Array.isArray(nodes) || !overrides) return nodes;
    
    return nodes.map(function(node) {
        if (node.type !== 'image') return node;
        if (!overrides[node.src]) return node;
        
        return Object.assign({}, node, overrides[node.src]);
    });
}

/**
 * 验证图片节点字段合法性
 * 用于调试和测试
 * 
 * @param {Array<object>} nodes - 节点数组
 * @returns {{ valid: number, invalid: Array }} 校验结果
 */
function validateImageNodes(nodes) {
    var valid = 0;
    var invalid = [];
    
    nodes.forEach(function(node, index) {
        if (node.type !== 'image') return;
        
        var issues = [];
        
        // src 必须存在且非空
        if (!node.src) {
            issues.push('src is empty');
        }
        
        // align 必须为合法值
        if (node.align && ['left', 'center', 'right'].indexOf(node.align) === -1) {
            issues.push('invalid align: ' + node.align);
        }
        
        // width/height 如果存在必须是正数
        if (node.width !== null && node.width !== undefined && (typeof node.width !== 'number' || node.width <= 0)) {
            issues.push('invalid width: ' + node.width);
        }
        if (node.height !== null && node.height !== undefined && (typeof node.height !== 'number' || node.height <= 0)) {
            issues.push('invalid height: ' + node.height);
        }
        
        if (issues.length === 0) {
            valid++;
        } else {
            invalid.push({ index: index, node: node, issues: issues });
        }
    });
    
    return { valid: valid, invalid: invalid };
}

// ================================================================
// 导出
// ================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enrichImageNodes: enrichImageNodes,
        applyImageOverrides: applyImageOverrides,
        validateImageNodes: validateImageNodes
    };
}
