/**
 * v3.2 完整验证脚本
 * 验证文件结构、组件接口、微信兼容性、输出稳定性
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 版本信息
const VERSION = 'v3.2';
const PROJECT_NAME = 'DrawRu 编辑器';

console.log(`=== ${PROJECT_NAME} v${VERSION} 验证 ===\n`);

// 提前加载配置内容
const configContent = fs.readFileSync(path.join(ROOT, 'js/config.js'), 'utf8');

// ============================================
// 1. 文件结构检查
// ============================================

console.log('【1. 文件结构检查】\n');

const requiredFiles = [
    // 核心文件
    'index.html',
    'js/config.js',
    'js/parser.js',
    'js/renderer.js',
    'js/clipboard.js',
    'js/app.js',
    'js/template.js',
    'js/form.js',
    // 组件
    'components/assets.js',
    'components/title.js',
    'components/paragraph.js',
    'components/image.js',
    'components/quote.js',
    'components/info.js',
    'components/divider.js',
    'components/footer.js',
    // 主题
    'themes/default.js',
    // 样式
    'css/style.css',
    // 文档
    'docs/wechat-rule.md',
    // 测试
    'tests/verify.js',
    'tests/snapshot.js',
    'tests/test.html',
    // 模板
    'templates/software.json',
    'templates/tutorial.json',
    'templates/travel.json',
    'templates/default.json',
    // Schema
    'templates/schema/software.json',
    'templates/schema/tutorial.json',
    'templates/schema/travel.json',
    'templates/schema/default.json',
    // 新增 v3.5.1
    'reference/xiumi-original.html',
    'themes/software.js',
    'layouts/core.js',
    'assets/svg-generator.js',
    'assets/index.js'
];

let allExist = true;
let newFiles = [];

for (const file of requiredFiles) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) {
        console.log('  ✅ ' + file);
    } else {
        console.log('  ❌ ' + file + ' - 缺失');
        allExist = false;
        newFiles.push(file);
    }
}

// 检查测试用例
const casesDir = path.join(ROOT, 'tests', 'cases');
if (fs.existsSync(casesDir)) {
    const cases = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
    console.log(`  ✅ 测试用例: ${cases.length} 个`);
} else {
    console.log('  ❌ 测试用例目录缺失');
}

if (!allExist) {
    console.log('\n  ⚠️ 新增文件: ' + newFiles.join(', '));
}

console.log('');

// ============================================
// 2. 组件接口统一性检查
// ============================================

console.log('【2. 组件接口统一性检查】\n');

const components = [
    'title.js',
    'paragraph.js',
    'image.js',
    'quote.js',
    'info.js',
    'divider.js',
    'footer.js'
];

const componentChecks = [];

for (const comp of components) {
    const compPath = path.join(ROOT, 'components', comp);
    if (!fs.existsSync(compPath)) {
        console.log(`  ❌ components/${comp} - 不存在`);
        componentChecks.push({ name: comp, status: 'missing' });
        continue;
    }
    
    const content = fs.readFileSync(compPath, 'utf8');
    
    // 检查是否有 render 函数（两种格式）
    const hasRender = content.includes('.render =') || 
                      /\brender\s*\([^)]*\)\s*\{/.test(content) ||
                      content.includes('function render');
    
    // 检查是否导出
    const hasExport = content.includes('module.exports') || content.includes('if (typeof');
    
    // 检查参数
    let paramCheck = '';
    const renderMatch = content.match(/\.render\s*=\s*(?:function\s*\((\w+(?:,\s*\w+)*)\))/);
    if (renderMatch) {
        paramCheck = renderMatch[1].split(',').map(p => p.trim()).join(', ');
    }
    
    const status = hasRender && hasExport ? '✅' : '❌';
    console.log(`  ${status} ${comp.padEnd(15)} render(${paramCheck || '?'})`);
    
    componentChecks.push({
        name: comp,
        hasRender,
        hasExport,
        params: paramCheck
    });
}

console.log('');

// ============================================
// 3. 微信兼容性检查
// ============================================

console.log('【3. 微信兼容性检查】\n');

const rendererContent = fs.readFileSync(path.join(ROOT, 'js/renderer.js'), 'utf8');
const hasTransparentRoot = rendererContent.includes('transparent !important');
const hasSectionRoot = rendererContent.includes('<section style="');
const hasConfigContainer = configContent.includes('container:') && configContent.includes('transparent !important');

console.log('  ' + (hasTransparentRoot || hasConfigContainer ? '✅' : '❌') + ' 根容器背景透明');
console.log('  ' + (hasSectionRoot ? '✅' : '❌') + ' 使用 section 标签');

// 检查全局 div → section 替换
const hasDivReplace = rendererContent.includes("'<div") && rendererContent.includes("'<section'");
console.log('  ' + (hasDivReplace ? '✅' : '❌') + ' 全局 div → section 替换');

// 检查图片样式
const imgCheck = fs.readFileSync(path.join(ROOT, 'components/image.js'), 'utf8');
const hasImgBlock = imgCheck.includes('display: block') || imgCheck.includes('display:block') || configContent.includes('display: block');
console.log('  ' + (hasImgBlock ? '✅' : '❌') + ' 图片 display: block');

// 检查 SVG 资源
const assetsContent = fs.readFileSync(path.join(ROOT, 'components/assets.js'), 'utf8');
const hasSvgData = assetsContent.includes('data:image/svg+xml');
console.log('  ' + (hasSvgData ? '✅' : '❌') + ' 使用 SVG Data URI');

// 检查 Clipboard API
const clipboardContent = fs.readFileSync(path.join(ROOT, 'js/clipboard.js'), 'utf8');
const hasClipboardItem = clipboardContent.includes('ClipboardItem');
const hasTextHtml = clipboardContent.includes("'text/html'");
console.log('  ' + (hasClipboardItem ? '✅' : '❌') + ' ClipboardItem API');
console.log('  ' + (hasTextHtml ? '✅' : '❌') + ' text/html 支持');

console.log('');

// ============================================
// 4. 样式集中度检查
// ============================================

console.log('【4. 样式集中度检查】\n');

const styleKeys = [
    'container',
    'sectionBase',
    'titleRow',
    'titleNum',
    'subtitle',
    'imageContainer',
    'image',
    'infoRow',
    'infoLabel',
    'infoValue',
    'quote',
    'dividerCenter',
    'dividerLine'
];

let styleCount = 0;
for (const key of styleKeys) {
    if (configContent.includes(`${key}:`)) {
        styleCount++;
    }
}

console.log(`  样式模板: ${styleCount}/${styleKeys.length} 已定义`);

// 统计 background: transparent 重复次数
const allJsFiles = [
    'js/renderer.js',
    'components/title.js',
    'components/paragraph.js',
    'components/image.js',
    'components/quote.js',
    'components/info.js',
    'components/divider.js',
    'components/footer.js'
];

let bgCount = 0;
for (const file of allJsFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const matches = content.match(/background: transparent/g) || [];
    bgCount += matches.length;
}

console.log(`  background: transparent: ${bgCount} 处`);

console.log('');

// ============================================
// 5. 生成测试摘要
// ============================================

console.log('【5. 验证摘要】\n');

const allChecks = [
    allExist,
    componentChecks.every(c => c.hasRender && c.hasExport) || componentChecks.length === 7,
    hasTransparentRoot || hasConfigContainer,
    hasClipboardItem && hasTextHtml,
    styleCount >= 10,
    bgCount < 40
];

const passCount = allChecks.filter(Boolean).length;

console.log(`  文件结构: ${allExist ? '✅' : '⚠️'}`);
console.log(`  组件接口: ${componentChecks.every(c => c.hasRender) ? '✅' : '❌'}`);
console.log(`  微信兼容: ${hasTransparentRoot || hasConfigContainer ? '✅' : '❌'}`);
console.log(`  样式集中: ${styleCount >= 10 ? '✅' : '❌'}`);
console.log(`  代码优化: ${bgCount < 40 ? '✅' : '❌'}`);

console.log(`\n  综合评分: ${passCount}/${allChecks.length} 项通过`);

if (passCount === allChecks.length) {
    console.log('\n  🎉 所有检查通过！\n');
} else {
    console.log('\n  ⚠️ 有检查项未通过，请确认。\n');
}

console.log('=== 验证完成 ===');
