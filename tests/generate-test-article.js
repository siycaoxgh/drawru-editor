/**
 * DrawRu v3.5.1 测试文章生成器
 * 
 * 生成一篇完整的软件分享测试文章
 * 包含所有组件类型
 */

const fs = require('fs');

// 加载依赖
const path = require('path');
const baseDir = path.resolve(__dirname, '..');

const THEME = require(baseDir + '/themes/software.js');
const Layouts = require(baseDir + '/layouts/core.js');
const TitleComponent = require(baseDir + '/components/title.js');
const ParagraphComponent = require(baseDir + '/components/paragraph.js');
const ImageComponent = require(baseDir + '/components/image.js');
const QuoteComponent = require(baseDir + '/components/quote.js');
const InfoComponent = require(baseDir + '/components/info.js');
const DividerComponent = require(baseDir + '/components/divider.js');
const FooterComponent = require(baseDir + '/components/footer.js');

// 渲染器
class TestRenderer {
    constructor(theme, layouts) {
        this.theme = theme;
        this.layouts = layouts;
    }
    
    render(nodes) {
        let html = '';
        
        // 根容器
        html += `<section style="
            background-color: transparent !important;
            padding: 0px;
            box-sizing: border-box;
            font-style: normal;
            font-weight: 400;
            text-align: justify;
            font-size: 16px;
            color: ${this.theme.getColor('text')};
        ">`;
        
        // 头部
        html += FooterComponent.render({ type: 'header', theme: this.theme }, this.theme, this.layouts);
        
        // 顶部分割线
        html += DividerComponent.render({ type: 'triple' }, this.theme, this.layouts);
        
        // 内容节点
        for (const node of nodes) {
            switch (node.type) {
                case 'title':
                    html += TitleComponent.render(node.num, node.label, this.theme, this.layouts);
                    break;
                case 'info':
                    html += InfoComponent.render(node.label, node.value, this.theme, this.layouts);
                    break;
                case 'image':
                    html += ImageComponent.render(node.alt, node.src, this.theme, this.layouts);
                    break;
                case 'paragraph':
                    html += ParagraphComponent.render(node.text, this.theme, this.layouts);
                    break;
                case 'quote':
                    html += QuoteComponent.render(node.text, this.theme, this.layouts);
                    break;
                case 'divider':
                    html += DividerComponent.render({ type: node.variant || 'triple' }, this.theme, this.layouts);
                    break;
            }
        }
        
        // 底部分割线
        html += DividerComponent.render({ type: 'bottom' }, this.theme, this.layouts);
        
        // END
        html += FooterComponent.render({ type: 'end' }, this.theme, this.layouts);
        
        // 关闭根容器
        html += `</section>`;
        
        // div → section
        html = html.replace(/<div/gi, '<section').replace(/<\/div>/gi, '</section>');
        
        return html;
    }
}

// 测试数据
const testNodes = [
    // 章节 01
    { type: 'title', num: '01', label: '【软件概览】' },
    { type: 'info', label: '软件名称：', value: 'TrafficMonitor' },
    { type: 'info', label: '软件大小：', value: '约 2MB - 5MB（含 Lite 版）' },
    { type: 'info', label: '软件版本：', value: 'V1.86' },
    { type: 'info', label: '更新日期：', value: '2026/03/29' },
    { type: 'info', label: '适配平台：', value: 'Windows' },
    
    // 测试图片
    {
        type: 'image',
        alt: 'TrafficMonitor 截图',
        src: 'https://img.xiumi.us/xmi/ua/2kcXV/i/dcf93ac026fe13427d53a77b9be3c094-sz_165151.jpg?x-oss-process=image/resize,limit_1,m_lfit,w_1080/crop,h_499,w_1080,x_0,y_156'
    },
    
    // 章节 02
    { type: 'title', num: '02', label: '【软件介绍】' },
    { type: 'paragraph', text: 'TrafficMonitor 是一款运行在 Windows 平台上的**极简开源**实时监控工具。' },
    { type: 'paragraph', text: '它主要用于在桌面上、任务栏中实时显示**网速**（上传/下载）、CPU 利用率、内存占用以及硬件温度等关键系统信息。' },
    { type: 'paragraph', text: '凭借其轻量化的设计、强大的皮肤定制功能以及对多显示器环境的完美支持，它已成为 Windows 用户优化桌面体验、监控硬件状态的装机必备神器。' },
    
    // 引用
    { type: 'quote', text: '软件体积小、资源占用低、完全免费开源，是这类工具中的佼佼者。' },
    
    // 章节 03
    { type: 'title', num: '03', label: '【主要功能】' },
    { type: 'paragraph', text: '**多维度实时监控**：实时追踪上传/下载速度、CPU 与内存占用率。' },
    { type: 'paragraph', text: '**任务栏深度集成**：支持将监控数据嵌入任务栏，并能根据 Windows 主题色自动调整背景颜色。' },
    { type: 'paragraph', text: '**高度自定义皮肤**：用户可更换皮肤，现已支持为每个皮肤单独保存字体、颜色及显示文本内容。' },
    { type: 'paragraph', text: '**多语言本地化**：采用全新的外部 .ini 配置文件重构，新增了德语、意语、俄语等多国语言支持。' },
    
    // 结尾图片
    {
        type: 'image',
        alt: '功能截图',
        src: 'https://img.xiumi.us/xmi/ua/2kcXV/i/0e29ba3bedb67faacd8612e54edc4b10-sz_28374.png?x-oss-process=image/resize,limit_1,m_lfit,w_1080/crop,h_205,w_364,x_0,y_32'
    }
];

// 生成
const renderer = new TestRenderer(THEME, Layouts);
const html = renderer.render(testNodes);

// 输出
console.log('=== DrawRu v3.5.1 测试文章 HTML ===');
console.log('');
console.log(html);
console.log('');
console.log('=== HTML 长度:', html.length, '字符 ===');
