/**
 * 布局层 - Layouts
 * 
 * 职责：提供 section 容器、flex 布局、group 组合等结构层
 * 组件不负责布局，只负责渲染具体内容
 * 
 * 设计原则：
 * 1. 纯布局，不含业务逻辑
 * 2. 返回 HTML 字符串
 * 3. 支持主题色注入
 */

function escapeLayoutHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const Layouts = {
    /**
     * 创建一个带样式的 section 容器
     * @param {object} options - 配置项
     * @param {string} options.className - class 名
     * @param {object} options.styles - 内联样式对象
     * @param {string} options.content - 内容
     * @param {string} options.tag - 标签名，默认 section
     * @returns {string} HTML
     */
    section(options = {}) {
        const {
            className = '',
            styles = {},
            content = '',
            tag = 'section'
        } = options;
        
        const styleStr = Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');
        
        const classAttr = className ? ` class="${className}"` : '';
        const styleAttr = styleStr ? ` style="${styleStr}"` : '';
        
        return `<${tag}${classAttr}${styleAttr}>${content}</${tag}>`;
    },
    
    /**
     * 创建 flex 行容器（横向）
     * 对应秀米: display: flex; flex-flow: row
     */
    flexRow(options = {}) {
        const {
            justifyContent = 'flex-start',
            alignItems = 'flex-end',
            margin = '0px',
            content = '',
            styles = {}
        } = options;
        
        const baseStyles = {
            'display': 'flex',
            'flex-flow': 'row',
            'justify-content': justifyContent,
            'align-items': alignItems,
            'margin': margin,
            ...styles
        };
        
        return this.section({ styles: baseStyles, content });
    },
    
    /**
     * 创建 flex 列容器（纵向）
     * 对应秀米: display: flex; flex-flow: column
     */
    flexCol(options = {}) {
        const {
            justifyContent = 'flex-start',
            alignItems = 'flex-start',
            margin = '0px',
            content = '',
            styles = {}
        } = options;
        
        const baseStyles = {
            'display': 'flex',
            'flex-flow': 'column',
            'justify-content': justifyContent,
            'align-items': alignItems,
            'margin': margin,
            ...styles
        };
        
        return this.section({ styles: baseStyles, content });
    },
    
    /**
     * 创建 inline-block 容器
     * 对应秀米: display: inline-block
     */
    inlineBlock(options = {}) {
        const {
            verticalAlign = 'bottom',
            width = 'auto',
            margin = '0px',
            content = '',
            styles = {}
        } = options;
        
        const baseStyles = {
            'display': 'inline-block',
            'vertical-align': verticalAlign,
            'width': width,
            'margin': margin,
            ...styles
        };
        
        return this.section({ styles: baseStyles, content });
    },
    
    /**
     * 创建 group 包装器
     * 对应秀米的深层嵌套 section
     */
    group(options = {}) {
        const {
            transform = '',
            styles = {},
            content = ''
        } = options;
        
        const baseStyles = {
            'position': 'static',
            ...styles
        };
        
        if (transform) {
            baseStyles['transform'] = transform;
        }
        
        return this.section({ styles: baseStyles, content });
    },
    
    /**
     * 创建图片容器
     * 对应秀米: 图片外层 section + 虚线边框
     */
    imageContainer(options = {}) {
        const {
            border = {},
            margin = '10px 0px',
            content = '',
            styles = {}
        } = options;
        
        const {
            borderWidth = '2px',
            borderStyle = 'dotted',
            borderColor = 'rgb(175, 207, 238)',
            borderRadius = '10px'
        } = border;
        
        const baseStyles = {
            'text-align': 'center',
            'line-height': '0',
            'margin': margin,
            'border-style': borderStyle,
            'border-width': borderWidth,
            'border-color': borderColor,
            'border-radius': borderRadius,
            ...styles
        };
        
        return this.section({ styles: baseStyles, content });
    },
    
    /**
     * 创建空 group（用于占位）
     * 对应秀米: class="group-empty"
     */
    emptyGroup(options = {}) {
        const {
            width = '1px',
            height = '1px',
            styles = {}
        } = options;
        
        const baseStyles = {
            'display': 'inline-block',
            'vertical-align': 'top',
            'width': width,
            'height': height,
            'flex': '0 0 auto',
            ...styles
        };
        
        return this.section({ 
            className: 'group-empty',
            styles: baseStyles,
            content: '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>'
        });
    },
    
    /**
     * 创建文字段落
     */
    paragraph(options = {}) {
        const {
            fontSize = '16px',
            color = 'rgb(62, 62, 62)',
            margin = '0px 0px 16px',
            content = '',
            escapeContent = true,
            styles = {}
        } = options;
        
        const baseStyles = {
            'font-size': fontSize,
            'color': color,
            'margin': margin,
            'white-space': 'normal',
            ...styles
        };
        
        const safeContent = escapeContent ? escapeLayoutHtml(content) : content;
        return `<p style="${Object.entries(baseStyles).map(([k,v]) => `${k}: ${v}`).join('; ')}">${safeContent}</p>`;
    },
    
    /**
     * 创建 span 文字
     */
    span(options = {}) {
        const {
            fontSize = '',
            color = '',
            backgroundColor = '',
            content = '',
            styles = {}
        } = options;
        
        const baseStyles = { ...styles };
        if (fontSize) baseStyles['font-size'] = fontSize;
        if (color) baseStyles['color'] = color;
        if (backgroundColor) baseStyles['background-color'] = backgroundColor;
        
        const styleAttr = Object.keys(baseStyles).length > 0 
            ? ` style="${Object.entries(baseStyles).map(([k,v]) => `${k}: ${v}`).join('; ')}"` 
            : '';
        
        return `<span${styleAttr}>${content}</span>`;
    },
    
    /**
     * 创建列表容器
     */
    orderedList(options = {}) {
        const {
            content = '',
            styles = {}
        } = options;
        
        const baseStyles = {
            'list-style-type': 'decimal',
            'box-sizing': 'border-box',
            'padding-left': '20px',
            'list-style-position': 'outside',
            ...styles
        };
        
        return `<ol style="${Object.entries(baseStyles).map(([k,v]) => `${k}: ${v}`).join('; ')}">${content}</ol>`;
    },
    
    /**
     * 创建列表项
     */
    listItem(options = {}) {
        const {
            content = '',
            margin = '0px 0px 16px',
            styles = {}
        } = options;
        
        const baseStyles = {
            'box-sizing': 'border-box',
            ...styles
        };
        
        return `<li style="${Object.entries(baseStyles).map(([k,v]) => `${k}: ${v}`).join('; ')}">${content}</li>`;
    },
    
    /**
     * 组合多个布局元素
     * @param {...string} parts - HTML 部分
     * @returns {string} 组合后的 HTML
     */
    combine(...parts) {
        return parts.join('');
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Layouts;
}
