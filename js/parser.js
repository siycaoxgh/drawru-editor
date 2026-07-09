/**
 * 模块：Markdown 解析器
 * 负责将 Markdown 文本解析为节点数组
 * 不负责生成 HTML
 */

/**
 * 解析 Markdown 文本为节点数组
 * @param {string} content - Markdown 文本
 * @returns {Array} 节点数组
 */
function parseMarkdown(content) {
    const nodes = [];
    const lines = content.split('\n');
    let i = 0;
    
    while (i < lines.length) {
        let line = lines[i].trim();
        
        // 空行
        if (!line) {
            i++;
            continue;
        }
        
        // 章节编号 (01, 02...)
        if (/^0[1-9]$/.test(line)) {
            const num = line;
            i++;
            
            // 检查下一行是否是 【xxx】 小标题
            let label = '';
            if (i < lines.length) {
                const nextLine = lines[i].trim();
                if (nextLine.startsWith('【') && nextLine.endsWith('】')) {
                    label = nextLine;
                    i++;
                }
            }
            
            nodes.push({ type: 'title', num, label });
            continue;
        }
        
        // 小标题
        if (line.startsWith('【') && line.endsWith('】')) {
            nodes.push({ type: 'subtitle', text: line });
            i++;
            continue;
        }
        
        // 图片
        const imgMatch = line.match(/^!\[(.*?)\]\((.+?)\)$/);
        if (imgMatch) {
            nodes.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
            i++;
            continue;
        }
        
        // 信息列表（标签：值）
        const infoMatch = line.match(/^(.{1,6})[：:]\s*(.+)$/);
        if (infoMatch) {
            nodes.push({ type: 'info', label: infoMatch[1] + '：', value: infoMatch[2] });
            i++;
            continue;
        }
        
        // 有序列表
        const listMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (listMatch) {
            nodes.push({ type: 'list', index: listMatch[1], text: listMatch[2] });
            i++;
            continue;
        }
        
        // 引用
        if (line.startsWith('>')) {
            const text = line.substring(1).trim();
            nodes.push({ type: 'quote', text });
            i++;
            continue;
        }
        
        // 普通段落
        nodes.push({ type: 'paragraph', text: line });
        i++;
    }
    
    return nodes;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseMarkdown };
}
