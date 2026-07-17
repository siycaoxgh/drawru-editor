/**
 * 模块：剪贴板复制 v3.5.5-beta (修订版 - iframe 隔离方案)
 * 
 * 复制策略：
 * 1. iframe + execCommand (主路径) - 微信兼容，隔离主页面 CSS 污染
 * 2. ClipboardItem (fallback) - 仅当 iframe 复制失败时使用
 * 
 * 修复历史：
 * - v3.5.5-beta 发现 execCommand 复制时主页面 CSS 环境污染（灰色背景）
 * - 改为 iframe 独立 document 方案，完全隔离主页面样式
 * - 微信环境验证：ClipboardItem 优先会导致纯文本（微信只读 text/plain）
 * - 因此 iframe-execCommand 必须作为主路径
 */

'use strict';

// ============================================================================
// 日志工具
// ============================================================================

const ClipboardLogger = {
    log(message, data) {
        console.log(`[Clipboard] ${message}`, data || '');
    },
    
    success(method, htmlLength, plainLength) {
        console.log(`[Clipboard] ✓ ${method} 复制成功 | HTML: ${htmlLength} | Plain: ${plainLength}`);
    },
    
    error(method, error) {
        console.error(`[Clipboard] ✗ ${method} 失败:`, error);
    },
    
    info(message) {
        console.log(`[Clipboard] ℹ ${message}`);
    }
};

// ============================================================================
// 主路径：iframe + execCommand（优先）
//
// 微信公众号富文本编辑器依赖浏览器原生 execCommand 复制的 HTML MIME，
// ClipboardItem 写入的 text/html 在微信中不被读取（只读 text/plain），
// 因此 iframe-execCommand 必须作为主路径。
// Clipboard API 作为备用方案（仅当 iframe 复制失败时回退）。
// ============================================================================

/**
 * 检查是否支持 ClipboardItem API
 * @returns {boolean}
 */
function supportsClipboardItem() {
    return typeof ClipboardItem !== 'undefined' && 
           navigator.clipboard && 
           typeof navigator.clipboard.write === 'function';
}

/**
 * 使用 ClipboardItem 复制 HTML（备用方案）
 *
 * 仅当 iframe-execCommand 失败时回退使用。
 * 
 * @param {string} html - HTML 内容
 * @param {string} plainText - 纯文本内容
 * @returns {Promise<boolean>} 是否成功
 */
async function copyWithClipboardItem(html, plainText) {
    if (!html || typeof html !== 'string') {
        ClipboardLogger.error('ClipboardItem', new Error('html 参数无效'));
        return false;
    }
    
    try {
        // 创建 HTML Blob
        const htmlBlob = new Blob([html], { type: 'text/html' });
        
        // 创建纯文本 Blob
        const plainBlob = new Blob([plainText || ''], { type: 'text/plain' });
        
        // 创建 ClipboardItem
        const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': plainBlob
        });
        
        // 写入剪贴板
        await navigator.clipboard.write([clipboardItem]);
        
        return true;
        
    } catch (err) {
        ClipboardLogger.error('ClipboardItem', err);
        return false;
    }
}

// ============================================================================
// Fallback 路径：iframe + execCommand (隔离主页面 CSS)
// ============================================================================

/**
 * 使用 iframe 隔离文档 + execCommand 复制 HTML
 * 
 * 关键修复：
 * - 不使用 document.createElement('div') + document.body.appendChild
 * - 使用独立 iframe document，完全隔离主页面 CSS
 * - iframe body 设置 background: transparent，避免灰色背景污染
 * 
 * @param {string} html - 原始 HTML（来自 renderer.renderArticle()）
 * @returns {boolean} 是否成功
 */
function copyWithIframeExecCommand(html) {
    // 验证输入
    if (!html || typeof html !== 'string') {
        ClipboardLogger.error('iframe-execCommand', new Error('html 参数无效'));
        return false;
    }
    
    // 创建隐藏 iframe（不可见但可选中，不使用 display:none）
    const iframe = document.createElement('iframe');
    
    Object.assign(iframe.style, {
        position: 'fixed',
        left: '-9999px',
        top: '0',
        width: '1000px',
        height: '1000px',
        border: 'none',
        opacity: '1',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: '-1'
    });
    
    // 添加到文档（仅用于执行 execCommand）
    document.body.appendChild(iframe);
    
    let success = false;
    
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // 写入独立文档（body 背景透明，隔离主页面 CSS）
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html>');
        iframeDoc.write('<html>');
        iframeDoc.write('<head>');
        iframeDoc.write('<meta charset="UTF-8">');
        iframeDoc.write('<style>');
        iframeDoc.write('html,body{margin:0;padding:0;background:transparent;}');
        iframeDoc.write('</style>');
        iframeDoc.write('</head>');
        iframeDoc.write('<body>');
        iframeDoc.write(html);
        iframeDoc.write('</body>');
        iframeDoc.write('</html>');
        iframeDoc.close();
        
        // 在 iframe 中执行复制
        const iframeWin = iframe.contentWindow;
        const selection = iframeWin.getSelection();
        selection.removeAllRanges();
        
        const range = iframeDoc.createRange();
        range.selectNodeContents(iframeDoc.body);
        selection.addRange(range);
        
        success = iframeDoc.execCommand('copy');
        
        // 清理选中状态
        selection.removeAllRanges();
        
        ClipboardLogger.log('iframe-execCommand 执行结果', { success });
        
        return success;
        
    } catch (err) {
        ClipboardLogger.error('iframe-execCommand', err);
        return false;
        
    } finally {
        // 移除 iframe（复制已完成）
        if (iframe.parentNode) {
            document.body.removeChild(iframe);
        }
    }
}

// ============================================================================
// 主接口
// ============================================================================

/**
 * 复制 HTML 富文本到剪贴板
 * 
 * v3.5.5-beta (修订版 - iframe 隔离):
 * - iframe + execCommand 主路径（秀米类似效果，微信兼容）
 * - ClipboardItem fallback（仅当 iframe 复制失败时）
 * 
 * 重要：微信富文本编辑器依赖浏览器原生复制的 HTML MIME，
 *       ClipboardItem 写入的 text/html 在微信中不被读取（只读 text/plain）。
 *       因此 iframe-execCommand 必须作为主路径。
 * 
 * @param {string} html - renderer.renderArticle() 返回的原始 HTML
 * @returns {Promise<boolean>} 是否成功
 */
async function copyHTML(html) {
    // 验证输入
    if (!html || typeof html !== 'string') {
        ClipboardLogger.error('copyHTML', new Error('html 参数为空或无效'));
        return false;
    }
    
    const htmlLength = html.length;
    
    // 生成纯文本
    const plainText = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
    
    const plainLength = plainText.length;
    
    ClipboardLogger.log('开始复制', {
        'HTML 长度': htmlLength,
        'Plain 长度': plainLength,
        'HTML 前200字符': html.substring(0, 200)
    });
    
    // ================================================================
    // 主路径：iframe + execCommand（微信兼容，隔离主页面 CSS）
    // ================================================================
    ClipboardLogger.info('尝试 iframe-execCommand...');
    
    const iframeSuccess = copyWithIframeExecCommand(html);
    
    if (iframeSuccess) {
        ClipboardLogger.success('iframe-execCommand', htmlLength, plainLength);
        return true;
    }
    
    ClipboardLogger.info('iframe-execCommand 失败，尝试 ClipboardItem...');
    
    // ================================================================
    // Fallback 路径：ClipboardItem（仅当 iframe 复制失败时）
    // ================================================================
    if (supportsClipboardItem()) {
        try {
            const itemSuccess = await copyWithClipboardItem(html, plainText);
            if (itemSuccess) {
                ClipboardLogger.success('ClipboardItem', htmlLength, plainLength);
                return true;
            }
        } catch (err) {
            ClipboardLogger.error('ClipboardItem', err);
        }
    }
    
    ClipboardLogger.error('copyHTML', new Error('所有复制方法均失败'));
    return false;
}

/**
 * 复制到剪贴板（兼容旧接口）
 * @param {string} html - HTML 内容
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(html) {
    return await copyHTML(html);
}

/**
 * 获取当前支持的复制方式
 * @returns {string}
 */
function getClipboardMethod() {
    if (supportsClipboardItem()) {
        return 'iframe-execCommand + ClipboardItem(fallback)';
    } else if (document.execCommand) {
        return 'iframe-execCommand (仅)';
    }
    return '不支持';
}

// ============================================================================
// 导出
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        copyHTML, 
        copyToClipboard,
        copyWithClipboardItem,
        copyWithIframeExecCommand,
        supportsClipboardItem,
        getClipboardMethod,
        ClipboardLogger
    };
}
