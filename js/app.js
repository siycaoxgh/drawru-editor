/**
 * 模块：主应用
 * DrawRu 编辑器核心逻辑
 */

// 全局实例
let renderer = null;
let currentTemplate = 'software';
let currentSchema = null;

/**
 * 初始化应用
 */
function initApp() {
    // 初始化渲染器
    renderer = new MarkdownRenderer(THEME);
    
    // 绑定事件
    bindEvents();
    
    // 绑定模板选择事件
    bindTemplateEvents();
    
    // 默认选中第一个模板
    selectTemplate('software');
    
    // 加载示例
    loadExample();
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 应用模板按钮
    const applyBtn = document.querySelector('.btn-primary');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyTemplate);
    }
    
    // 复制按钮
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyToClipboardHandler);
    }
    
    // 清空按钮
    const clearBtn = document.querySelector('.btn-white');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }
    
    // Markdown 编辑器变化时同步到表单（可选）
    const editor = document.getElementById('editor');
    if (editor) {
        editor.addEventListener('input', debounce(onEditorChange, 500));
    }
}

/**
 * 防抖函数
 */
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * 编辑器内容变化
 */
function onEditorChange() {
    // Markdown 变化时可以考虑反向同步到表单（可选功能）
    // 目前保持 Markdown 为唯一内容源
}

/**
 * 绑定模板选择事件
 */
function bindTemplateEvents() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const templateName = card.dataset.template;
            selectTemplate(templateName);
        });
    });
}

/**
 * 选择模板
 * @param {string} templateName - 模板名称
 */
function selectTemplate(templateName) {
    currentTemplate = templateName;
    
    // 更新 UI
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === templateName) {
            card.classList.add('active');
        }
    });
    
    // 获取 schema 并生成表单
    currentSchema = TemplateEngine.getSchema(templateName);
    const formHTML = FormEngine.generateFormHTML(currentSchema);
    
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
        formContainer.innerHTML = formHTML;
        
        // 绑定表单输入事件
        bindFormEvents();
    }
    
    // 使用模板引擎生成 Markdown
    const markdown = TemplateEngine.generateWithFields(templateName);
    
    const editor = document.getElementById('editor');
    if (editor) {
        editor.value = markdown;
        showToast(`已加载「${templateName}」模板`);
    }
}

/**
 * 绑定表单事件
 */
function bindFormEvents() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(onFormChange, 300));
    });
    
    // 图片预览
    const imageInputs = document.querySelectorAll('.form-input-image');
    imageInputs.forEach(input => {
        input.addEventListener('input', debounce(onImageInput, 300));
    });
}

/**
 * 表单内容变化，同步到 Markdown
 */
function onFormChange() {
    // 收集表单数据
    const formData = {};
    const formInputs = document.querySelectorAll('[data-key]');
    
    formInputs.forEach(input => {
        const key = input.dataset.key;
        const value = input.value;
        formData[key] = value;
    });
    
    // 获取当前模板
    const template = TemplateEngine.get(currentTemplate);
    
    // 生成 Markdown
    const markdown = FormEngine.generateMarkdown(currentSchema, formData, template);
    
    // 更新编辑器
    const editor = document.getElementById('editor');
    if (editor) {
        editor.value = markdown;
    }
}

/**
 * 图片输入变化，更新预览
 */
function onImageInput(e) {
    const input = e.target;
    const previewId = input.id + '-preview';
    const preview = document.getElementById(previewId);
    
    if (preview) {
        const url = input.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            preview.innerHTML = `<img src="${url}" alt="预览" onerror="this.parentElement.innerHTML='<span class=placeholder-text>图片加载失败</span>'">`;
        } else {
            preview.innerHTML = '<span class="placeholder-text">预览区域</span>';
        }
    }
}

/**
 * 切换到表单模式
 */
function switchToForm() {
    const switchForm = document.getElementById('switch-form');
    const switchMd = document.getElementById('switch-md');
    const mdPanel = document.getElementById('md-panel');
    const formArea = document.getElementById('form-area');
    
    if (switchForm) switchForm.classList.add('active');
    if (switchMd) switchMd.classList.remove('active');
    if (mdPanel) mdPanel.style.display = 'none';
    if (formArea) formArea.style.display = 'block';
}

/**
 * 切换到 Markdown 模式
 */
function switchToMd() {
    const switchForm = document.getElementById('switch-form');
    const switchMd = document.getElementById('switch-md');
    const mdPanel = document.getElementById('md-panel');
    const formArea = document.getElementById('form-area');
    
    if (switchForm) switchForm.classList.remove('active');
    if (switchMd) switchMd.classList.add('active');
    if (mdPanel) mdPanel.style.display = 'flex';
    if (formArea) formArea.style.display = 'none';
}

/**
 * 应用模板
 */
function applyTemplate() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    
    if (!editor || !editor.value.trim()) {
        showToast('请先输入内容');
        return;
    }
    
    // 解析 Markdown
    const nodes = parseMarkdown(editor.value);
    
    // 渲染 HTML
    const html = renderer.renderArticle(nodes);
    
    // 更新预览
    preview.innerHTML = html;
    
    showToast('✓ 模板应用成功');
}

/**
 * 复制到剪贴板
 */
async function copyToClipboardHandler() {
    const preview = document.getElementById('preview');
    
    if (!preview || preview.innerText.includes('选择模板并填写')) {
        showToast('请先应用模板');
        return;
    }
    
    const html = preview.innerHTML;
    
    try {
        await copyHTML(html);
        
        const btn = document.getElementById('copyBtn');
        if (btn) {
            btn.innerHTML = '✓ 已复制';
            btn.classList.add('copied');
        }
        
        showToast('已复制到剪贴板，请在公众号后台粘贴');
        
        setTimeout(() => {
            const btn = document.getElementById('copyBtn');
            if (btn) {
                btn.innerHTML = '📋 复制到剪贴板';
                btn.classList.remove('copied');
            }
        }, 2000);
    } catch (err) {
        showToast('复制失败，请手动复制');
    }
}

/**
 * 显示提示
 */
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

/**
 * 加载示例
 */
function loadExample() {
    const markdown = TemplateEngine.generateWithFields(currentTemplate);
    
    const editor = document.getElementById('editor');
    if (editor) {
        editor.value = markdown;
        showToast('已加载模板，点击「应用模板」查看效果');
    }
}

/**
 * 清空所有
 */
function clearAll() {
    const editor = document.getElementById('editor');
    const preview = document.getElementById('preview');
    
    if (editor) editor.value = '';
    if (preview) {
        preview.innerHTML = '<p style="color: #999; text-align: center; padding: 60px 0;">选择模板并填写内容后<br>点击「应用模板」查看效果</p>';
    }
    
    // 清空表单
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    formInputs.forEach(input => {
        input.value = '';
    });
    
    showToast('已清空');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
