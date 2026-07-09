/**
 * HTML Snapshot 快照机制
 * 用于记录和验证 HTML 输出的变化
 */

const fs = require('fs');
const path = require('path');

const SNAPSHOT_DIR = path.join(__dirname, '..', 'tests', 'snapshots');

/**
 * 保存 HTML 快照
 * @param {string} name - 快照名称
 * @param {string} html - HTML 内容
 * @param {string} version - 版本号
 */
function saveSnapshot(name, html, version = 'v3.2') {
    if (!fs.existsSync(SNAPSHOT_DIR)) {
        fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }
    
    const filename = `${name}-${version}.html`;
    const filepath = path.join(SNAPSHOT_DIR, filename);
    
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✅ 快照已保存: ${filename}`);
    return filepath;
}

/**
 * 加载 HTML 快照
 * @param {string} name - 快照名称
 * @param {string} version - 版本号
 * @returns {string|null} HTML 内容或 null
 */
function loadSnapshot(name, version = 'v3.2') {
    const filename = `${name}-${version}.html`;
    const filepath = path.join(SNAPSHOT_DIR, filename);
    
    if (fs.existsSync(filepath)) {
        return fs.readFileSync(filepath, 'utf8');
    }
    return null;
}

/**
 * 比较两个 HTML 是否相同
 * @param {string} html1 - 第一个 HTML
 * @param {string} html2 - 第二个 HTML
 * @returns {object} 比较结果
 */
function compareHTML(html1, html2) {
    // 标准化 HTML（去除空白差异）
    const normalize = (html) => html.replace(/\s+/g, ' ').trim();
    
    const n1 = normalize(html1);
    const n2 = normalize(html2);
    
    if (n1 === n2) {
        return { equal: true, diff: null };
    }
    
    // 计算简单差异
    const len1 = n1.length;
    const len2 = n2.length;
    const diff = Math.abs(len1 - len2);
    
    return {
        equal: false,
        diff: {
            len1,
            len2,
            diffChars: diff
        }
    };
}

/**
 * 运行所有测试用例并保存快照
 * @param {object} renderer - MarkdownRenderer 实例
 * @param {object} parser - parseMarkdown 函数
 */
function runAllCases(renderer, parser) {
    const casesDir = path.join(__dirname, 'cases');
    const cases = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
    
    console.log('\n=== 运行测试用例 ===\n');
    
    const results = [];
    
    for (const caseFile of cases) {
        const casePath = path.join(casesDir, caseFile);
        const caseData = JSON.parse(fs.readFileSync(casePath, 'utf8'));
        
        console.log(`测试: ${caseData.name}`);
        
        try {
            const nodes = parser(caseData.input);
            const html = renderer.renderArticle(nodes);
            
            // 保存快照
            const snapshotName = caseFile.replace('.json', '');
            const snapshotPath = saveSnapshot(snapshotName, html);
            
            results.push({
                name: caseData.name,
                category: caseData.category,
                success: true,
                snapshotPath,
                nodeCount: nodes.length,
                htmlLength: html.length
            });
            
            console.log(`  ✅ 节点: ${nodes.length}, HTML长度: ${html.length}`);
        } catch (err) {
            results.push({
                name: caseData.name,
                category: caseData.category,
                success: false,
                error: err.message
            });
            console.log(`  ❌ 错误: ${err.message}`);
        }
    }
    
    return results;
}

/**
 * 验证 HTML 输出稳定性
 * @param {object} renderer - MarkdownRenderer 实例
 * @param {object} parser - parseMarkdown 函数
 */
function verifyStability(renderer, parser) {
    const casesDir = path.join(__dirname, 'cases');
    const cases = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
    
    console.log('\n=== 验证输出稳定性 ===\n');
    
    const results = [];
    
    for (const caseFile of cases) {
        const casePath = path.join(casesDir, caseFile);
        const caseData = JSON.parse(fs.readFileSync(casePath, 'utf8'));
        const snapshotName = caseFile.replace('.json', '');
        
        // 生成当前 HTML
        const nodes = parser(caseData.input);
        const currentHTML = renderer.renderArticle(nodes);
        
        // 加载已有快照
        const snapshotHTML = loadSnapshot(snapshotName);
        
        if (snapshotHTML === null) {
            console.log(`${caseData.name}: 🆕 无快照，首次运行`);
            results.push({
                name: caseData.name,
                status: 'new',
                nodeCount: nodes.length,
                htmlLength: currentHTML.length
            });
        } else {
            const comparison = compareHTML(currentHTML, snapshotHTML);
            
            if (comparison.equal) {
                console.log(`${caseData.name}: ✅ 输出稳定`);
                results.push({
                    name: caseData.name,
                    status: 'stable',
                    nodeCount: nodes.length
                });
            } else {
                console.log(`${caseData.name}: ⚠️ 输出变化 (${comparison.diff.diffChars} 字符差异)`);
                results.push({
                    name: caseData.name,
                    status: 'changed',
                    nodeCount: nodes.length,
                    diff: comparison.diff
                });
            }
        }
    }
    
    return results;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SNAPSHOT_DIR,
        saveSnapshot,
        loadSnapshot,
        compareHTML,
        runAllCases,
        verifyStability
    };
}
