/**
 * 模块：Markdown 解析器 v3.5.5-alpha
 * 
 * 数据流：
 * Markdown → Tokenize → 内部 AST → Compatibility Adapter → Renderer nodes
 * 
 * 接口：
 * parseMarkdown(content)  →  返回兼容现有 renderer 的 nodes
 * parseMarkdown.ast(content)  →  返回内部 AST（可选）
 */

// ============================================================================
// AST 节点类型定义
// ============================================================================

const AST_NODE_TYPES = {
    HEADING: 'heading',      // 标题
    PARAGRAPH: 'paragraph',  // 段落
    IMAGE: 'image',          // 图片
    QUOTE: 'quote',          // 引用
    LIST: 'list',            // 列表
    INFO: 'info',            // 信息
    UNKNOWN: 'unknown'       // 未知
};

// ============================================================================
// 第一层：Tokenize（分词）
// ============================================================================

/**
 * 简单分词器
 * @param {string} content - Markdown 文本
 * @returns {Array} token 数组
 */
function tokenize(content) {
    const tokens = [];
    const lines = content.split('\n');
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // 空行
        if (!trimmed) {
            tokens.push({ type: 'blank', raw: line });
            i++;
            continue;
        }
        
        // Markdown 标题（## 或 ###）
        const headingMatch = trimmed.match(/^(#{2,3})\s+(.*)$/);
        if (headingMatch) {
            tokens.push({
                type: 'heading',
                depth: headingMatch[1].length,
                raw: trimmed,
                fullMatch: headingMatch[0]
            });
            i++;
            continue;
        }
        
        // 旧格式章节编号（01, 02...）
        const numMatch = trimmed.match(/^(0[1-9]|1[0-9]|20)$/);
        if (numMatch) {
            tokens.push({
                type: 'number',
                raw: trimmed,
                value: trimmed
            });
            i++;
            continue;
        }
        
        // 小标题 【xxx】
        if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
            tokens.push({
                type: 'label',
                raw: trimmed
            });
            i++;
            continue;
        }
        
        // 图片（标准语法）
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
        if (imgMatch) {
            var rawSrc = imgMatch[2];
            var token = {
                type: 'image',
                alt: imgMatch[1],
                src: rawSrc,
                raw: trimmed
            };
            if (rawSrc.indexOf("asset:") === 0 && rawSrc.length > 6) {
                token.assetId = rawSrc.substring(6);
                token.src = '';
            }
            tokens.push(token);
            i++;
            if (i < lines.length && lines[i].trim().match(/^\{.+?=.+?\}$/)) {
                tokens.push({
                    type: 'image_attrs',
                    raw: lines[i].trim()
                });
                i++;
            }
            continue;
        }
        
        // 信息（标签：值）
        // 仅匹配已知 info 字段关键词：软件名称/版本/平台/大小/语言/类型/官网/价格/作者/标签
const infoKeywords = ["软件名称","版本","平台","大小","语言","类型","官网","价格","作者","标签","名称"];
        let infoMatch = null;
        const maybeInfo = trimmed.match(/^(.{1,6})[：:]\s*(.+)$/);
        if (maybeInfo && infoKeywords.indexOf(maybeInfo[1]) >= 0) {
            infoMatch = maybeInfo;
        }
        if (infoMatch) {
            tokens.push({
                type: 'info',
                label: infoMatch[1] + '：',
                value: infoMatch[2],
                raw: trimmed
            });
            i++;
            continue;
        }
        
        // 无序列表 (- item)
        const ulMatch = trimmed.match(/^-\s+(.+)$/);
        if (ulMatch) {
            tokens.push({
                type: 'list_item',
                index: '•',
                text: ulMatch[1],
                raw: trimmed
            });
            i++;
            continue;
        }
        
        // 有序列表 (1. item)
        const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (olMatch) {
            tokens.push({
                type: 'list_item',
                index: olMatch[1],
                text: olMatch[2],
                raw: trimmed
            });
            i++;
            continue;
        }
        
        // 引用
        if (trimmed.startsWith('>')) {
            tokens.push({
                type: 'quote',
                text: trimmed.substring(1).trim(),
                raw: trimmed
            });
            i++;
            continue;
        }
        
        // 普通段落
        tokens.push({
            type: 'text',
            raw: trimmed
        });
        i++;
    }
    
    return tokens;
}

// ============================================================================
// ============================================================================
// Phase 2-B1: 图片属性解析器
// ============================================================================

/**
 * 解析图片属性块 {width=800 height=600 caption="hello"}
 * @param {string} raw - 原始属性字符串（含花括号）
 * @returns {object} 解析后的属性对象
 */
function parseImageAttrs(raw) {
    var attrs = {};
    if (!raw || typeof raw !== 'string') return attrs;
    
    // 去掉花括号
    var inner = raw.trim();
    if (inner.startsWith('{') && inner.endsWith('}')) {
        inner = inner.slice(1, -1).trim();
    }
    if (!inner) return attrs;
    
    // 按空白分割，但保留引号内的内容
    var parts = [];
    var buf = '';
    var inQuote = false;
    var quoteChar = '';
    
    for (var j = 0; j < inner.length; j++) {
        var ch = inner[j];
        if ((ch === '"' || ch === "'") && !inQuote) {
            inQuote = true;
            quoteChar = ch;
        } else if (ch === quoteChar && inQuote) {
            inQuote = false;
            quoteChar = '';
        } else if (ch === ' ' && !inQuote) {
            if (buf.trim()) { parts.push(buf.trim()); buf = ''; }
        } else {
            buf += ch;
        }
    }
    if (buf.trim()) parts.push(buf.trim());
    
    // 解析每个 key=value
    parts.forEach(function(part) {
        var eqIdx = part.indexOf('=');
        if (eqIdx <= 0) return;
        var key = part.substring(0, eqIdx).trim();
        var val = part.substring(eqIdx + 1).trim();
        if (!key) return;
        
        // 去掉值两边的引号
        if ((val.startsWith('"') && val.endsWith('"')) || 
            (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        
        // 类型推断
        if (val === 'true') { attrs[key] = true; }
        else if (val === 'false') { attrs[key] = false; }
        else if (/^-?\d+$/.test(val)) { attrs[key] = parseInt(val, 10); }
        else if (/^-?\d+\.\d+$/.test(val)) { attrs[key] = parseFloat(val); }
        else { attrs[key] = val; }
    });
    
    return attrs;
}


// 第二层：AST 构建
// ============================================================================

/**
 * 将 tokens 转换为内部 AST
 * @param {Array} tokens - token 数组
 * @returns {Array} AST 节点数组
 */
function buildAST(tokens) {
    const ast = [];
    let i = 0;
    let autoNumberH2 = 0;
    
    while (i < tokens.length) {
        const token = tokens[i];
        
        // 跳过空行
        if (token.type === 'blank') {
            i++;
            continue;
        }
        
        // Markdown 标题 ## 或 ###
        if (token.type === 'heading') {
            const heading = parseHeadingToken(token, autoNumberH2);
            ast.push(heading);
            
            // 更新自动编号（只在 h2 时递增）
            if (token.depth === 2) {
                autoNumberH2++;
            }
            i++;
            continue;
        }
        
        // 旧格式章节编号 + 小标题
        if (token.type === 'number') {
            const num = token.value;
            i++;
            
            // 检查下一行是否是【xxx】
            if (i < tokens.length && tokens[i].type === 'label') {
                const labelToken = tokens[i];
                const text = labelToken.raw.slice(1, -1);  // 去掉【】
                
                ast.push({
                    type: AST_NODE_TYPES.HEADING,
                    depth: 2,
                    number: num,
                    text: text,
                    sourceSyntax: 'legacy'
                });
                i++;
                continue;
            }
            
            // 只有编号没有小标题
            ast.push({
                type: AST_NODE_TYPES.UNKNOWN,
                raw: num
            });
            continue;
        }
        
        // 独立小标题【xxx】（不在章节编号后）
        if (token.type === 'label') {
            const text = token.raw.slice(1, -1);
            ast.push({
                type: AST_NODE_TYPES.HEADING,
                depth: 2,
                number: String(autoNumberH2 + 1).padStart(2, '0'),
                text: text,
                sourceSyntax: 'label-only'
            });
            autoNumberH2++;
            i++;
            continue;
        }
        
        // 图片（Phase 2-B1: 支持属性块，白名单过滤）
        if (token.type === 'image') {
            var imageAttrs = {};
            // 检查下一行是否是图片属性块（必须含 =，避免吞掉普通花括号文本）
            if (i + 1 < tokens.length && tokens[i + 1].type === 'image_attrs') {
                var rawAttrs = parseImageAttrs(tokens[i + 1].raw);
                // v3.5.7 安全白名单: 只允许 width/height/align/border/caption
                var ALLOWED_ATTRS = ['width','height','align','border','caption'];
                for (var ak = 0; ak < ALLOWED_ATTRS.length; ak++) {
                    var key = ALLOWED_ATTRS[ak];
                    if (rawAttrs.hasOwnProperty(key)) {
                        imageAttrs[key] = rawAttrs[key];
                    }
                }
                i++; // 跳过属性 token
            }
            ast.push(Object.assign({
                type: AST_NODE_TYPES.IMAGE,
                alt: token.alt,
                src: token.src,
                assetId: token.assetId || ""
            }, imageAttrs));
            i++;
            continue;
        }

        
        // 信息
        if (token.type === 'info') {
            ast.push({
                type: AST_NODE_TYPES.INFO,
                label: token.label,
                value: token.value
            });
            i++;
            continue;
        }
        
        // 列表项
        if (token.type === 'list_item') {
            const listItems = [token];
            // 收集后续连续列表项
            while (i + 1 < tokens.length && tokens[i + 1].type === 'list_item') {
                i++;
                listItems.push(tokens[i]);
            }
            
            ast.push({
                type: AST_NODE_TYPES.LIST,
                ordered: true,
                items: listItems.map(item => ({
                    index: item.index,
                    text: item.text
                }))
            });
            i++;
            continue;
        }
        
        // 引用
        if (token.type === 'quote') {
            ast.push({
                type: AST_NODE_TYPES.QUOTE,
                text: token.text
            });
            i++;
            continue;
        }
        
        // 普通文本
        if (token.type === 'text') {
            ast.push({
                type: AST_NODE_TYPES.PARAGRAPH,
                text: token.raw
            });
            i++;
            continue;
        }
        
        // 未知类型
        ast.push({
            type: AST_NODE_TYPES.UNKNOWN,
            raw: token.raw
        });
        i++;
    }
    
    return ast;
}

/**
 * 解析 Markdown 标题 token
 * @param {object} token - heading token
 * @param {number} autoNumberH2 - 当前自动编号
 * @returns {object} AST 节点
 */
function parseHeadingToken(token, autoNumberH2) {
    const text = token.fullMatch.replace(/^#{2,3}\s+/, '');
    let number = null;
    
    // v3.5.7: 支持 01-99 显式编号
    const numMatch = text.match(/^(0[1-9]|[1-9]\d)\s+(.+)$/);
    if (numMatch) {
        number = numMatch[1];
        return {
            type: AST_NODE_TYPES.HEADING,
            depth: token.depth,
            number: number,
            text: numMatch[2],
            sourceSyntax: 'markdown'
        };
    }
    
    // v3.5.7: 支持 01-99 编号紧跟
    const numOnlyMatch = text.match(/^(0[1-9]|[1-9]\d)(.+)$/);
    if (numOnlyMatch) {
        number = numOnlyMatch[1];
        return {
            type: AST_NODE_TYPES.HEADING,
            depth: token.depth,
            number: number,
            text: numOnlyMatch[2],
            sourceSyntax: 'markdown'
        };
    }
    
    // 无显式编号，使用自动编号
    return {
        type: AST_NODE_TYPES.HEADING,
        depth: token.depth,
        number: String(autoNumberH2 + 1).padStart(2, '0'),
        text: text,
        sourceSyntax: 'markdown'
    };
}

// ============================================================================
// 第三层：Compatibility Adapter（兼容适配器）
// ============================================================================

/**
 * 将 AST 转换为 Renderer 兼容的 nodes
 * @param {Array} ast - AST 节点数组
 * @returns {Array} renderer nodes
 */
function astToNodes(ast) {
    return ast.map(node => {
        switch (node.type) {
            case AST_NODE_TYPES.HEADING:
                // h2 渲染为 title，h3 渲染为 subtitle
                if (node.depth === 2) {
                    return {
                        type: 'title',
                        num: node.number,
                        label: '【' + node.text + '】'
                    };
                } else {
                    return {
                        type: 'subtitle',
                        text: node.text
                    };
                }
                
            case AST_NODE_TYPES.PARAGRAPH:
                return {
                    type: 'paragraph',
                    text: node.text
                };
                
            case AST_NODE_TYPES.IMAGE:
                // Phase 2-B1: 透传所有图片属性字段
                // Phase 2-B1.5: 透传 asset 协议字段
                return {
                    type: 'image',
                    alt: node.alt,
                    src: node.src,
                    width: node.width || null,
                    height: node.height || null,
                    align: node.align || 'center',
                    border: node.border !== false,
                    caption: node.caption || '',
                    title: node.title || '',
                    // Asset 协议字段（可选）
                    assetId: node.assetId || '',
                    format: node.format || '',
                    size: node.size || null,
                    variants: node.variants || {}
                };
            case AST_NODE_TYPES.QUOTE:
                return {
                    type: 'quote',
                    text: node.text
                };
                
            case AST_NODE_TYPES.LIST:
                // 返回所有列表项
                if (node.items && node.items.length > 0) {
                    return node.items.map(item => ({
                        type: 'list',
                        index: item.index,
                        text: item.text
                    }));
                }
                return [{
                    type: 'unknown',
                    raw: JSON.stringify(node)
                }];
                
            case AST_NODE_TYPES.INFO:
                return {
                    type: 'info',
                    label: node.label,
                    value: node.value
                };
                
            case AST_NODE_TYPES.UNKNOWN:
            default:
                return {
                    type: 'unknown',
                    raw: node.raw || JSON.stringify(node)
                };
        }
    }).filter(node => node.type !== 'unknown').flat();
}

// ============================================================================
// 主接口：parseMarkdown
// ============================================================================

/**
 * 解析 Markdown 文本
 * @param {string} content - Markdown 文本
 * @returns {Array} renderer 兼容的 nodes
 */
function parseMarkdown(content) {
    if (!content || typeof content !== 'string') {
        return [];
    }
    
    // 第一层：分词
    const tokens = tokenize(content);
    
    // 第二层：构建 AST
    const ast = buildAST(tokens);
    
    // 第三层：转换为 renderer nodes
    const nodes = astToNodes(ast);
    
    return nodes;
}

/**
 * 解析 Markdown 并返回内部 AST（调试用）
 * @param {string} content - Markdown 文本
 * @returns {Array} AST 节点数组
 */
parseMarkdown.ast = function(content) {
    if (!content || typeof content !== 'string') {
        return [];
    }
    
    const tokens = tokenize(content);
    const ast = buildAST(tokens);
    return ast;
};

/**
 * 解析 Markdown 并返回 tokens（调试用）
 * @param {string} content - Markdown 文本
 * @returns {Array} token 数组
 */
parseMarkdown.tokens = function(content) {
    if (!content || typeof content !== 'string') {
        return [];
    }
    
    return tokenize(content);
};

// ============================================================================
// 导出
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMarkdown, AST_NODE_TYPES };
}
