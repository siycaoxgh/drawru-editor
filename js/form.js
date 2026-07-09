/**
 * 表单引擎
 * 根据 schema 生成可视化填写表单
 */

const fs = require('fs');
const path = require('path');

/**
 * 表单管理器
 */
const FormEngine = {
    /**
     * 根据 schema 生成 HTML 表单
     * @param {object} schema - 字段定义
     * @returns {string} HTML 表单
     */
    generateFormHTML(schema) {
        if (!schema || !schema.fields) {
            return '<p>无字段定义</p>';
        }
        
        let html = '';
        
        for (const field of schema.fields) {
            html += this.generateFieldHTML(field);
        }
        
        return html;
    },
    
    /**
     * 生成单个字段的 HTML
     * @param {object} field - 字段定义
     * @returns {string} HTML
     */
    generateFieldHTML(field) {
        const id = this.sanitizeId(field.key);
        const required = field.required ? 'required' : '';
        const placeholder = field.placeholder || '';
        
        let fieldHTML = '';
        
        switch (field.type) {
            case 'textarea':
                fieldHTML = this.generateTextarea(id, field, placeholder, required);
                break;
            case 'image':
                fieldHTML = this.generateImageField(id, field, placeholder, required);
                break;
            case 'select':
                fieldHTML = this.generateSelect(id, field, placeholder, required);
                break;
            case 'text':
            default:
                fieldHTML = this.generateTextField(id, field, placeholder, required);
                break;
        }
        
        return fieldHTML;
    },
    
    /**
     * 生成文本输入框
     */
    generateTextField(id, field, placeholder, required) {
        return `
        <div class="form-group" data-field="${field.key}" data-type="text">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <input type="text" id="${id}" 
                   placeholder="${placeholder}"
                   ${required}
                   data-key="${field.key}"
                   class="form-input">
        </div>`;
    },
    
    /**
     * 生成多行文本框
     */
    generateTextarea(id, field, placeholder, required) {
        return `
        <div class="form-group" data-field="${field.key}" data-type="textarea">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <textarea id="${id}" 
                      placeholder="${placeholder}"
                      ${required}
                      data-key="${field.key}"
                      class="form-textarea"
                      rows="3"></textarea>
        </div>`;
    },
    
    /**
     * 生成图片上传字段
     */
    generateImageField(id, field, placeholder, required) {
        return `
        <div class="form-group" data-field="${field.key}" data-type="image">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <input type="text" id="${id}" 
                   placeholder="${placeholder || 'https://...'}（图片链接）"
                   ${required}
                   data-key="${field.key}"
                   class="form-input form-input-image">
            <div class="image-preview" id="${id}-preview">
                <span class="placeholder-text">预览区域</span>
            </div>
        </div>`;
    },
    
    /**
     * 生成下拉选择框
     */
    generateSelect(id, field, placeholder, required) {
        const options = field.options || [];
        let optionsHTML = `<option value="">${placeholder || '请选择'}</option>`;
        
        for (const opt of options) {
            optionsHTML += `<option value="${opt}">${opt}</option>`;
        }
        
        return `
        <div class="form-group" data-field="${field.key}" data-type="select">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <select id="${id}" 
                    data-key="${field.key}"
                    class="form-select"
                    ${required}>
                ${optionsHTML}
            </select>
        </div>`;
    },
    
    /**
     * 从表单数据生成 Markdown
     * @param {object} schema - 字段定义
     * @param {object} formData - 表单数据 { key: value }
     * @param {object} template - 模板对象
     * @returns {string} Markdown
     */
    generateMarkdown(schema, formData, template) {
        if (!schema || !schema.fields) {
            return '';
        }
        
        let markdown = '';
        
        // 处理每个 section
        if (template && template.sections) {
            let sectionIndex = 1;
            let imageIndex = 0;
            
            for (const section of template.sections) {
                if (section.type === 'title') {
                    markdown += `${String(sectionIndex).padStart(2, '0')}\n`;
                    markdown += `【${section.title}】\n`;
                    
                    if (section.content && typeof section.content === 'object') {
                        // info 类型
                        for (const [key, value] of Object.entries(section.content)) {
                            const formValue = formData[key] || '';
                            markdown += `${key}：${formValue}\n`;
                        }
                    } else if (section.content === '') {
                        // 空内容，尝试从表单获取
                        // 留空让用户填写
                    }
                    
                    markdown += '\n';
                    sectionIndex++;
                }
                else if (section.type === 'image') {
                    // 查找下一个未使用的图片字段
                    const imageFields = schema.fields.filter(f => f.type === 'image');
                    if (imageFields[imageIndex]) {
                        const imgField = imageFields[imageIndex];
                        const imgUrl = formData[imgField.key] || imgField.placeholder || 'https://example.com/image.jpg';
                        markdown += `![${section.title}](${imgUrl})\n\n`;
                        imageIndex++;
                    }
                }
                else if (section.type === 'quote') {
                    markdown += `> ${formData[section.key] || section.content || section.title}\n\n`;
                }
                else if (section.type === 'list') {
                    if (section.items && Array.isArray(section.items)) {
                        markdown += `${section.title || '列表'}：\n`;
                        section.items.forEach((item, idx) => {
                            markdown += `${idx + 1}. ${item}\n`;
                        });
                    }
                    markdown += '\n';
                }
                else if (section.type === 'paragraph') {
                    if (section.title) {
                        markdown += `**${section.title}**\n`;
                    }
                    markdown += `${formData[section.key] || section.content || ''}\n\n`;
                }
            }
        }
        
        return markdown.trim();
    },
    
    /**
     * 清理 ID，移除特殊字符
     */
    sanitizeId(key) {
        return 'field-' + key.replace(/[^\w\u4e00-\u9fa5]/g, '-').toLowerCase();
    },
    
    /**
     * 获取表单字段默认值
     * @param {object} schema - 字段定义
     * @returns {object} 默认值对象
     */
    getDefaults(schema) {
        const defaults = {};
        if (schema && schema.fields) {
            for (const field of schema.fields) {
                if (field.default !== undefined) {
                    defaults[field.key] = field.default;
                } else if (field.type === 'image') {
                    defaults[field.key] = field.placeholder || '';
                }
            }
        }
        return defaults;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormEngine;
}
