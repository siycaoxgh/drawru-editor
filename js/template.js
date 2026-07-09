/**
 * 模板引擎
 * 负责读取模板并生成 Markdown 框架
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SCHEMA_DIR = path.join(TEMPLATES_DIR, 'schema');

/**
 * 模板管理器
 */
const TemplateEngine = {
    /**
     * 获取所有可用模板
     * @returns {Array} 模板列表
     */
    getAll() {
        if (!fs.existsSync(TEMPLATES_DIR)) {
            return [];
        }
        
        const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
        const templates = [];
        
        for (const file of files) {
            const filePath = path.join(TEMPLATES_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const template = JSON.parse(content);
                template._file = file.replace('.json', '');
                templates.push(template);
            } catch (e) {
                console.warn(`⚠️ 加载模板失败: ${file}`);
            }
        }
        
        return templates;
    },
    
    /**
     * 根据名称获取模板
     * @param {string} name - 模板名称
     * @returns {object|null} 模板对象
     */
    get(name) {
        const templates = this.getAll();
        return templates.find(t => t._file === name || t.name === name) || null;
    },
    
    /**
     * 获取所有字段定义
     * @returns {Array} 字段定义列表
     */
    getAllSchemas() {
        if (!fs.existsSync(SCHEMA_DIR)) {
            return [];
        }
        
        const files = fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith('.json'));
        const schemas = [];
        
        for (const file of files) {
            const filePath = path.join(SCHEMA_DIR, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const schema = JSON.parse(content);
                schema._file = file.replace('.json', '');
                schemas.push(schema);
            } catch (e) {
                console.warn(`⚠️ 加载字段定义失败: ${file}`);
            }
        }
        
        return schemas;
    },
    
    /**
     * 根据模板名称获取字段定义
     * @param {string} name - 模板名称
     * @returns {object|null} 字段定义对象
     */
    getSchema(name) {
        const schemas = this.getAllSchemas();
        return schemas.find(s => s._file === name || s.name === name) || null;
    },
    
    /**
     * 将模板转换为 Markdown
     * @param {object} template - 模板对象
     * @returns {string} Markdown 文本
     */
    toMarkdown(template) {
        if (!template || !template.sections) {
            return '';
        }
        
        let markdown = '';
        let sectionIndex = 1;
        
        for (const section of template.sections) {
            // 添加章节标题
            if (section.type === 'title') {
                markdown += `${String(sectionIndex).padStart(2, '0')}\n`;
                markdown += `【${section.title}】\n`;
                
                // 根据内容类型生成
                if (section.content === '' || section.content === undefined) {
                    markdown += '\n';
                } else if (typeof section.content === 'string') {
                    markdown += `${section.content}\n`;
                } else if (typeof section.content === 'object') {
                    // info 类型
                    for (const [key, value] of Object.entries(section.content)) {
                        markdown += `${key}：${value || ''}\n`;
                    }
                }
                
                markdown += '\n';
                sectionIndex++;
            }
            
            // 图片
            else if (section.type === 'image') {
                markdown += `![${section.title}](${section.placeholder || 'https://example.com/image.jpg'})\n\n`;
            }
            
            // 引用
            else if (section.type === 'quote') {
                markdown += `> ${section.content || section.title}\n\n`;
            }
            
            // 列表
            else if (section.type === 'list') {
                markdown += `${section.title || '列表'}：\n`;
                if (section.items && Array.isArray(section.items)) {
                    section.items.forEach((item, idx) => {
                        markdown += `${idx + 1}. ${item}\n`;
                    });
                }
                markdown += '\n';
            }
            
            // 段落
            else if (section.type === 'paragraph') {
                if (section.title) {
                    markdown += `**${section.title}**\n`;
                }
                markdown += `${section.content || ''}\n\n`;
            }
        }
        
        return markdown.trim();
    },
    
    /**
     * 生成带字段提示的 Markdown
     * @param {object} template - 模板对象
     * @param {object} schema - 字段定义对象
     * @returns {string} 带填写提示的 Markdown
     */
    generateWithFields(template, schema) {
        if (!template || !template.sections) {
            return '';
        }
        
        let markdown = '';
        let sectionIndex = 1;
        const fields = schema ? schema.fields : [];
        const fieldMap = {};
        
        // 建立字段映射
        if (fields.length > 0) {
            markdown += `<!-- 字段提示：以下内容请根据实际情况填写 -->\n`;
            markdown += `<!-- ${'='.repeat(40)} -->\n`;
            
            fields.forEach(field => {
                fieldMap[field.key] = field;
                const typeHint = field.type === 'image' ? '(图片)' : '';
                const reqHint = field.required ? '[必填]' : '[选填]';
                markdown += `<!-- ${field.key} ${reqHint} ${typeHint} -->\n`;
            });
            
            markdown += `<!-- ${'='.repeat(40)} -->\n\n`;
        }
        
        for (const section of template.sections) {
            // 添加章节标题
            if (section.type === 'title') {
                markdown += `${String(sectionIndex).padStart(2, '0')}\n`;
                markdown += `【${section.title}】\n`;
                
                // 根据内容类型生成
                if (section.content === '' || section.content === undefined) {
                    markdown += '\n';
                } else if (typeof section.content === 'string') {
                    markdown += `${section.content}\n`;
                } else if (typeof section.content === 'object') {
                    // info 类型 - 使用字段定义
                    for (const [key, value] of Object.entries(section.content)) {
                        const field = fieldMap[key];
                        if (field) {
                            markdown += `${key}：${field.placeholder || ''}\n`;
                        } else {
                            markdown += `${key}：${value || ''}\n`;
                        }
                    }
                }
                
                markdown += '\n';
                sectionIndex++;
            }
            
            // 图片
            else if (section.type === 'image') {
                // 查找对应的图片字段
                const imageField = fields.find(f => f.type === 'image' && !f._used);
                if (imageField) {
                    imageField._used = true;
                    markdown += `![${section.title}](${imageField.placeholder})\n\n`;
                } else {
                    markdown += `![${section.title}](https://example.com/image.jpg)\n\n`;
                }
            }
            
            // 引用
            else if (section.type === 'quote') {
                markdown += `> ${section.content || section.title}\n\n`;
            }
            
            // 列表
            else if (section.type === 'list') {
                markdown += `${section.title || '列表'}：\n`;
                if (section.items && Array.isArray(section.items)) {
                    section.items.forEach((item, idx) => {
                        markdown += `${idx + 1}. ${item}\n`;
                    });
                }
                markdown += '\n';
            }
            
            // 段落
            else if (section.type === 'paragraph') {
                if (section.title) {
                    markdown += `**${section.title}**\n`;
                }
                markdown += `${section.content || ''}\n\n`;
            }
        }
        
        return markdown.trim();
    },
    
    /**
     * 根据模板名称生成 Markdown
     * @param {string} templateName - 模板名称
     * @returns {string} Markdown 文本
     */
    generate(templateName) {
        const template = this.get(templateName);
        if (!template) {
            console.warn(`⚠️ 模板不存在: ${templateName}`);
            return '';
        }
        return this.toMarkdown(template);
    },
    
    /**
     * 根据模板名称生成带字段提示的 Markdown
     * @param {string} templateName - 模板名称
     * @returns {string} Markdown 文本
     */
    generateWithFields(templateName) {
        const template = this.get(templateName);
        const schema = this.getSchema(templateName);
        
        if (!template) {
            console.warn(`⚠️ 模板不存在: ${templateName}`);
            return '';
        }
        
        return this.generateWithFields(template, schema);
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
}
