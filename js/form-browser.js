/**
 * 表单引擎（浏览器版）
 * 
 * 负责生成表单 HTML 和 Markdown
 * 
 * 无 Node.js 依赖，所有数据内联
 * 
 * v3.5.5-alpha: 使用明确的字段映射，不依赖 section.title 作为 key
 */

const FormEngine = {
    /**
     * 字段映射定义
     * 定义表单字段 key 到 Markdown 输出的映射关系
     */
    fieldMappings: {
        // 软件模板字段
        software: {
            '软件名称': { markdownKey: '软件名称', section: 'software' },
            '软件大小': { markdownKey: '软件大小', section: 'info' },
            '软件版本': { markdownKey: '版本', section: 'info' },
            '更新日期': { markdownKey: '更新日期', section: 'info' },
            '适配平台': { markdownKey: '适配平台', section: 'info' },
            '官网链接': { markdownKey: '官网', section: 'info' },
            '软件截图': { markdownKey: '截图', section: 'image' }
        },
        // 默认模板字段
        default: {
            '文章标题': { markdownKey: '标题', section: 'software' },
            '封面图片': { markdownKey: '封面', section: 'image' }
        }
    },
    
    /**
     * 获取模板对应的字段映射
     */
    getFieldMapping(templateName) {
        return this.fieldMappings[templateName] || this.fieldMappings['default'];
    },
    
    /**
     * 生成表单 HTML
     * @param {Array} fields - 字段数组
     * @returns {string} HTML
     */
    generateFormHTML(fields) {
        if (!fields || !fields.length) {
            return '<p class="form-placeholder">无可用字段</p>';
        }
        
        let html = '';
        
        fields.forEach((field, index) => {
            const id = 'field-' + index;
            const placeholder = field.placeholder || '';
            const required = field.required ? 'required' : '';
            
            if (field.type === 'image') {
                html += this.generateImageField(id, field, placeholder, required);
            } else if (field.type === 'select') {
                html += this.generateSelect(id, field, placeholder, required);
            } else if (field.placeholder && field.placeholder.includes('\n')) {
                html += this.generateTextarea(id, field, placeholder, required);
            } else {
                html += this.generateTextField(id, field, placeholder, required);
            }
        });
        
        return html;
    },
    
    /**
     * 生成文本输入框
     */
    generateTextField(id, field, placeholder, required) {
        return `
        <div class="form-group">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <input type="text" 
                   id="${id}" 
                   class="form-input" 
                   data-key="${field.key}"
                   placeholder="${placeholder}"
                   ${required}>
        </div>`;
    },
    
    /**
     * 生成文本域
     */
    generateTextarea(id, field, placeholder, required) {
        return `
        <div class="form-group">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <textarea id="${id}" 
                      class="form-textarea" 
                      data-key="${field.key}"
                      placeholder="${placeholder}"
                      rows="4"
                      ${required}></textarea>
        </div>`;
    },
    
    /**
     * 生成图片输入框
     */
    generateImageField(id, field, placeholder, required) {
        return `
        <div class="form-group">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <input type="text" 
                   id="${id}" 
                   class="form-input form-input-image" 
                   data-key="${field.key}"
                   placeholder="${placeholder || 'https://...'}"
                   ${required}>
            <div id="${id}-preview" class="image-preview">
                <span class="placeholder-text">图片预览区域</span>
            </div>
        </div>`;
    },
    
    /**
     * 生成下拉选择框
     */
    generateSelect(id, field, placeholder, required) {
        let options = '';
        if (field.options && field.options.length) {
            options = field.options.map(opt => 
                `<option value="${opt}">${opt}</option>`
            ).join('');
        }
        
        return `
        <div class="form-group">
            <label for="${id}">
                ${field.key}
                ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            <select id="${id}" 
                    class="form-select" 
                    data-key="${field.key}"
                    ${required}>
                <option value="">${placeholder || '请选择'}</option>
                ${options}
            </select>
        </div>`;
    },
    
    /**
     * 生成 Markdown（从表单数据）
     * 
     * v3.5.5-alpha: 使用明确的字段映射
     * 
     * @param {Array} schema - 字段 schema
     * @param {object} formData - 表单数据 { '软件名称': 'xxx', '版本': 'xxx' }
     * @param {object} template - 模板定义
     * @returns {string} Markdown
     */
    generateMarkdown(schema, formData, template) {
        let md = '';
        
        if (!template || !template.sections) {
            return md;
        }
        
        // 获取字段映射
        const fieldMap = this.getFieldMapping(template._file || 'default');
        
        // 生成主标题（软件名称/教程标题等）
        const mainField = template.fields.find(f => f.required);
        if (mainField) {
            const value = formData[mainField.key] || '';
            if (value) {
                md += `# ${value}\n\n`;
            }
        }
        
        // 按 section 顺序生成内容
        let sectionNum = 0;
        template.sections.forEach((section) => {
            if (section.type === 'title') {
                sectionNum++;
                const num = String(sectionNum).padStart(2, '0');
                md += `## ${num} ${section.title}\n\n`;
                
                // 查找对应的字段内容
                const field = template.fields.find(f => 
                    f.key === section.title || 
                    (fieldMap[f.key] && fieldMap[f.key].markdownKey === section.title)
                );
                if (field) {
                    const value = formData[field.key] || '';
                    if (value) {
                        md += value + '\n\n';
                    }
                }
            } else if (section.type === 'image') {
                const field = template.fields.find(f => 
                    f.type === 'image' || 
                    f.key === section.title ||
                    (fieldMap[f.key] && fieldMap[f.key].section === 'image')
                );
                if (field) {
                    const value = formData[field.key] || '';
                    if (value) {
                        md += `\n![${section.title}](${value})\n\n`;
                    }
                }
            } else if (section.type === 'quote') {
                const field = template.fields.find(f => f.key === section.title);
                if (field) {
                    const value = formData[field.key] || '';
                    if (value) {
                        md += `> ${value}\n>\n`;
                    }
                }
            } else if (section.type === 'list') {
                // 列表暂时用占位符
                md += `- ${section.title} 1\n- ${section.title} 2\n- ${section.title} 3\n\n`;
            } else if (section.type === 'info') {
                // 信息框：查找所有相关字段
                const infoFields = template.fields.filter(f => 
                    f.key !== mainField?.key && 
                    f.type !== 'image'
                );
                infoFields.forEach(f => {
                    const value = formData[f.key] || '';
                    if (value) {
                        md += `${f.key}：${value}\n`;
                    }
                });
                if (infoFields.length > 0) {
                    md += '\n';
                }
            }
        });
        
        return md;
    },
    
    /**
     * 收集表单数据
     * @param {string} containerId - 表单容器 ID
     * @returns {object} 表单数据
     */
    collectFormData(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return {};
        
        const formData = {};
        const inputs = container.querySelectorAll('[data-key]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-key');
            const value = input.value.trim();
            if (key && value) {
                formData[key] = value;
            }
        });
        
        return formData;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormEngine;
}
