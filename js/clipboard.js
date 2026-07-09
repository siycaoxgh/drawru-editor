/**
 * 模块：剪贴板复制
 * 使用 ClipboardItem API 实现富文本复制
 */

/**
 * 复制 HTML 富文本到剪贴板
 * @param {string} html - HTML 内容
 * @returns {Promise<void>}
 */
async function copyHTML(html) {
    // 创建 HTML Blob
    const htmlBlob = new Blob([html], { type: 'text/html' });
    
    // 创建纯文本 Blob（降级用）
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textBlob = new Blob([tempDiv.innerText], { type: 'text/plain' });
    
    // 使用 ClipboardItem API
    const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
    });
    
    await navigator.clipboard.write([item]);
}

/**
 * 复制到剪贴板（兼容旧接口）
 * @param {string} html - HTML 内容
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(html) {
    try {
        await copyHTML(html);
        return true;
    } catch (err) {
        console.error('复制失败:', err);
        return false;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { copyHTML, copyToClipboard };
}
