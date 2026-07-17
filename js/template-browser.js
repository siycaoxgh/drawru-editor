/**
 * 模板引擎（浏览器版）
 * 
 * 负责生成 Markdown 框架
 * 
 * 无 Node.js 依赖，所有模板数据内联
 */

const TemplateEngine = {
    /**
     * 软件分享模板
     */
    software: {
        _file: 'software',
        name: '软件分享',
        description: '5 段式软件推荐模板',
        fields: [
            { key: '软件名称', placeholder: '请输入软件名称', required: true },
            { key: '软件大小', placeholder: '如：10MB', required: false },
            { key: '软件版本', placeholder: '如：V1.0', required: false },
            { key: '更新日期', placeholder: '如：2026/01/01', required: false },
            { key: '适配平台', placeholder: '选择平台', required: false, type: 'select', options: ['Windows', 'macOS', 'Linux', 'Windows / macOS', '全平台'] },
            { key: '官网链接', placeholder: 'https://...', required: false },
            { key: '软件截图', placeholder: 'https://...', required: false, type: 'image' }
        ],
        sections: [
            { type: 'title', title: '软件概览' },
            { type: 'image', title: '软件截图' },
            { type: 'title', title: '功能介绍' },
            { type: 'quote', title: '核心特点' },
            { type: 'title', title: '使用说明' },
            { type: 'list', title: '使用步骤' },
            { type: 'title', title: '注意事项' },
            { type: 'info', title: '补充信息' }
        ]
    },
    
    /**
     * 默认模板
     */
    default: {
        _file: 'default',
        name: '通用模板',
        description: '通用文章模板',
        fields: [
            { key: '文章标题', placeholder: '请输入文章标题', required: true },
            { key: '封面图片', placeholder: 'https://...', required: false, type: 'image' }
        ],
        sections: [
            { type: 'title', title: '引言' },
            { type: 'title', title: '正文' },
            { type: 'title', title: '总结' }
        ]
    },
    
    /**
     * 获取所有模板
     */
    getAll() {
        return Object.keys(this).map(key => {
            if (typeof this[key] === 'object' && this[key].name) {
                return { ...this[key], _file: key };
            }
            return null;
        }).filter(t => t !== null);
    },
    
    /**
     * 根据名称获取模板
     * v3.5.7: 返回模板时附加 _file 字段，供 FormEngine.fieldMappings 选路
     */
    get(name) {
        var t = this[name];
        if (!t) return null;
        // 模板对象已内联 _file，直接返回；未显式声明的回退用 name
        return Object.assign({ _file: name }, t);
    },
    
    /**
     * 获取 Schema
     */
    getSchema(name) {
        const template = this.get(name);
        return template ? template.fields : [];
    },
    
    /**
     * 生成带字段的 Markdown
     */
    generateWithFields(templateName) {
        const template = this.get(templateName) || this.get('software');
        let md = '';
        let sectionNum = 0;  // 只对标题类型的 section 编号
        
        // 生成模板内容
        template.sections.forEach((section) => {
            if (section.type === 'title') {
                sectionNum++;
                const num = String(sectionNum).padStart(2, '0');
                md += `## ${num} ${section.title}\n\n`;
            } else if (section.type === 'image') {
                md += `\n![${section.title}](https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg)\n\n`;
            } else if (section.type === 'quote') {
                md += `> ${section.title}\n>\n`;
            } else if (section.type === 'list') {
                md += `- ${section.title} 1\n- ${section.title} 2\n- ${section.title} 3\n\n`;
            } else if (section.type === 'info') {
                md += `**${section.title}**\n\n内容...\n\n`;
            }
        });
        
        return md;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
}
