/**
 * DrawRu 主应用 v3.7.0
 * 
 * 定位：本地化微信公众号 Markdown 排版工具
 * 工作流：AI 生成文章 → Markdown → DrawRu 排版 → 微信公众号
 * 
 * 变更 (v3.5.7)：
 * - 左侧面板改为「排版设置」：模板选择 + 文章配置面板
 * - 模板切换只改排版模板，不动文章内容
 * - FormEngine 降级为文章配置面板（标题/摘要/推荐文章）
 * - 推荐文章配置写入 DRAW_RU_RECOMMENDS
 */

// 全局实例
let renderer = null;
let currentTemplate = 'software';
let currentHTML = '';  // 存储渲染后的 HTML，Preview 和 Copy 共用同一份

/**
 * 初始化应用
 */
function initApp() {
    console.log('='.repeat(50));
    console.log('DrawRu v3.7.0 Initializing...');
    console.log('='.repeat(50));

    // 1. 初始化 ThemeManager
    if (typeof ThemeManager !== 'undefined') {
        ThemeManager.init();
    } else {
        console.error('[App] ERROR: ThemeManager not loaded');
        return;
    }
    console.log('[App] ThemeManager: OK');

    // 2. 初始化渲染器
    if (typeof MarkdownRenderer !== 'undefined') {
        renderer = new MarkdownRenderer(window.AppTheme.get());
        console.log('[App] Renderer: OK');
    } else {
        console.error('[App] ERROR: MarkdownRenderer not loaded');
        return;
    }

    // 3. 验证核心组件
    if (typeof TemplateEngine === 'undefined') { console.error('[App] ERROR: TemplateEngine not loaded'); return; }
    console.log('[App] TemplateEngine: OK');

    if (typeof copyHTML === 'undefined') { console.error('[App] ERROR: copyHTML not loaded'); return; }
    console.log('[App] Clipboard: OK');

    if (typeof parseMarkdown === 'undefined') { console.error('[App] ERROR: parseMarkdown not loaded'); return; }
    console.log('[App] Parser: OK');

    // 4. 渲染模板卡片
    renderTemplateCards();

    // 5. 渲染配置面板
    renderConfigPanel();

    // 6. 绑定事件
    bindEvents();
    console.log('[App] Event Binding: OK');

    // 7. 加载默认模板（不替换文章内容，只设置排版模板）
    selectTemplate(currentTemplate);
    loadExample();

    console.log('='.repeat(50));
    console.log('App Ready \u2713');
    console.log('='.repeat(50));
}

/**
 * 渲染模板选择卡片
 */
function renderTemplateCards() {
    var select = document.getElementById('template-select');
    if (select) {
        var options = [
            { key: 'software', name: '软件分享' },
            { key: 'default', name: '通用模板' }
        ];
        select.innerHTML = options.map(function(option) {
            return '<option value="' + option.key + '"' +
                (option.key === currentTemplate ? ' selected' : '') + '>' +
                option.name + '</option>';
        }).join('');
        select.addEventListener('change', function() {
            selectTemplate(select.value);
        });
        return;
    }

    var grid = document.getElementById('template-grid');
    if (!grid) return;

    var templates = [
        { key: 'software', name: '软件介绍', desc: '5 段式软件推荐布局', icon: '💻' },
        { key: 'default',   name: '默认文章', desc: '通用文章排版',         icon: '📄' }
    ];

    var html = '';
    templates.forEach(function(t) {
        var activeClass = t.key === currentTemplate ? ' active' : '';
        html += '<div class="template-card' + activeClass + '" data-template="' + t.key + '">';
        html += '<div class="template-card-icon">' + t.icon + '</div>';
        html += '<div class="template-card-info">';
        html += '<div class="template-card-name">' + t.name + '</div>';
        html += '<div class="template-card-desc">' + t.desc + '</div>';
        html += '</div></div>';
    });

    grid.innerHTML = html;

    // 绑定卡片点击
    var cards = grid.querySelectorAll('.template-card');
    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            var name = card.dataset.template;
            selectTemplate(name);
        });
    });
}

/**
 * 渲染文章配置面板
 */
function renderConfigPanel() {
    var container = document.getElementById('form-container');
    if (!container) return;

    var html = '';
    html += '<div class="config-section">';
    html += '<div class="form-section-title">📝 文章信息</div>';

    // 标题
    html += '<div class="form-group">';
    html += '<label for="cfg-title">标题</label>';
    html += '<input type="text" id="cfg-title" class="form-input" data-key="cfg_title" placeholder="文章标题">';
    html += '</div>';

    // 摘要
    html += '<div class="form-group">';
    html += '<label for="cfg-abstract">摘要</label>';
    html += '<textarea id="cfg-abstract" class="form-textarea" data-key="cfg_abstract" placeholder="文章摘要（可选）" rows="2"></textarea>';
    html += '</div>';

    html += '</div>';

    // 推荐文章配置
    html += '<div class="config-section">';
    html += '<div class="form-section-title">🔗 推荐文章</div>';
    html += '<p class="recommend-help">提示：推荐标题和图片 COS 链接必须同时填写，否则预览中不会显示该推荐项。</p>';

    for (var i = 1; i <= 2; i++) {
        html += '<div class="form-group recommend-group">';
        html += '<label for="cfg-rec' + i + '-title">推荐 ' + i + ' 标题</label>';
        html += '<input type="text" id="cfg-rec' + i + '-title" class="form-input" data-key="cfg_rec' + i + '_title" placeholder="推荐文章标题">';
        html += '<label for="cfg-rec' + i + '-image" style="margin-top:6px">推荐 ' + i + ' 图片 COS 链接</label>';
        html += '<input type="text" id="cfg-rec' + i + '-image" class="form-input form-input-image" data-key="cfg_rec' + i + '_image" placeholder="https://...">';

        // 图片预览
        html += '<div id="cfg-rec' + i + '-image-preview" class="image-preview">';
        html += '<span class="placeholder-text">图片预览区域</span>';
        html += '</div>';

        html += '</div>';
    }

    // 应用按钮
    html += '<button class="btn-config-apply" id="cfg-apply-btn" type="button">✅ 应用配置</button>';
    html += '</div>';

    container.innerHTML = html;

    // 绑定配置面板事件
    bindConfigEvents();
}

/**
 * 绑定配置面板事件
 */
function bindConfigEvents() {
    // 图片输入预览
    var imageInputs = document.querySelectorAll('.form-input-image');
    imageInputs.forEach(function(input) {
        input.addEventListener('input', debounce(onConfigImageInput, 300));
    });

    // 应用配置按钮
    var applyBtn = document.getElementById('cfg-apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyConfig);
    }
}

/**
 * 配置面板图片输入预览
 */
function onConfigImageInput(e) {
    var input = e.target;
    var previewId = input.id + '-preview';
    var preview = document.getElementById(previewId);

    if (preview) {
        var url = input.value.trim();
        // v3.5.7: 安全校验 — 仅允许 http/https/data:image
        if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('data:image/') === 0)) {
            preview.innerHTML = '<img src="' + url.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '" alt="预览">';
        } else if (url) {
            preview.innerHTML = '<span class="placeholder-text">不支持的协议</span>';
        } else {
            preview.innerHTML = '<span class="placeholder-text">图片预览区域</span>';
        }
    }
}

/**
 * 应用配置：写入 DRAW_RU_RECOMMENDS 并触发重新渲染
 */
function applyConfig() {
    // 更新推荐文章数据
    if (typeof DRAW_RU_RECOMMENDS !== 'undefined') {
        var newRecs = [];
        var incompleteRecommend = false;
        for (var i = 1; i <= 2; i++) {
            var titleEl = document.getElementById('cfg-rec' + i + '-title');
            var imageEl = document.getElementById('cfg-rec' + i + '-image');
            if (titleEl && imageEl) {
                var title = titleEl.value.trim();
                var image = imageEl.value.trim();
                if (title && image) {
                    newRecs.push({ title: title, image: image, url: '' });
                } else if (title || image) {
                    incompleteRecommend = true;
                }
            }
        }
        // 替换数组
        DRAW_RU_RECOMMENDS.length = 0;
        for (var j = 0; j < newRecs.length; j++) {
            DRAW_RU_RECOMMENDS.push(newRecs[j]);
        }
        // 补空位到 4
        while (DRAW_RU_RECOMMENDS.length < 4) {
            DRAW_RU_RECOMMENDS.push({ title: '', image: '', url: '' });
        }
        console.log('[Config] Recommend updated:', newRecs.length + ' items');
    }

    applyTemplate();
    showToast(incompleteRecommend
        ? '提示：推荐标题和图片链接需同时填写，未完整的推荐项已跳过'
        : '✓ 配置已应用');
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 应用模板按钮
    var applyBtn = document.getElementById('applyBtn');
    if (applyBtn) applyBtn.addEventListener('click', applyTemplate);

    // 复制按钮
    var copyBtn = document.getElementById('copyBtn');
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboardHandler);

    // 清空按钮
    var clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    // 模式切换：配置 ←→ Markdown
}

/**
 * 防抖函数
 */
function debounce(fn, delay) {
    var timer = null;
    return function() {
        var ctx = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
}

/**
 * 选择模板（只切换排版模板，不动文章内容）
 */
function selectTemplate(templateName) {
    currentTemplate = templateName;

    var templateSelect = document.getElementById('template-select');
    if (templateSelect) templateSelect.value = templateName;

    // 更新 UI 卡片
    var cards = document.querySelectorAll('.template-card');
    cards.forEach(function(card) {
        card.classList.remove('active');
        if (card.dataset.template === templateName) card.classList.add('active');
    });

    // 同步切换主题，再重新初始化渲染器。
    // 之前这里只更新了 currentTemplate，Renderer 仍然持有 software 主题，
    // 因此点击 default 后再应用模板时视觉不会发生变化。
    if (typeof ThemeManager !== 'undefined' && ThemeManager.set) {
        ThemeManager.set(templateName);
    }
    if (typeof MarkdownRenderer !== 'undefined' && window.AppTheme) {
        renderer = new MarkdownRenderer(window.AppTheme.get());
    }

    console.log('[App] Template switched to: ' + templateName);
}

/**
 * 切换到配置模式
 */
function switchToConfig() {
    var switchConfig = document.getElementById('switch-config');
    var switchMd = document.getElementById('switch-md');
    var mdPanel = document.getElementById('md-panel');
    var formArea = document.getElementById('form-area');

    if (switchConfig) switchConfig.classList.add('active');
    if (switchMd) switchMd.classList.remove('active');
    if (mdPanel) mdPanel.style.display = 'none';
    if (formArea) formArea.style.display = 'block';
}

/**
 * 切换到 Markdown 模式
 */
function switchToMd() {
    var switchConfig = document.getElementById('switch-config');
    var switchMd = document.getElementById('switch-md');
    var mdPanel = document.getElementById('md-panel');
    var formArea = document.getElementById('form-area');

    if (switchConfig) switchConfig.classList.remove('active');
    if (switchMd) switchMd.classList.add('active');
    if (mdPanel) mdPanel.style.display = 'flex';
    if (formArea) formArea.style.display = 'none';
}

/**
 * 应用模板（解析 Markdown → 渲染 → 插入模块 → 预览）
 */
function applyTemplate() {
    if (!renderer) {
        showToast('渲染器未初始化，请刷新页面');
        console.error('[App] ERROR: renderer is null');
        return;
    }

    var editor = document.getElementById('editor');
    var preview = document.getElementById('preview');

    if (!editor || !editor.value.trim()) {
        showToast('请先输入内容');
        return;
    }

    try {
        // 解析 Markdown
        var nodes = parseMarkdown(editor.value);

        // Phase 2-A.2: 图片节点增强
        var enriched = enrichImageNodes(nodes);
        var html = renderer.renderArticle(enriched);

        // Phase 3-Final v3.5.7: 文章模块插入
        // Header Images 使用 TRIPLE_DIVIDER 锚点
        // Footer 尾部（End+Copyright+Recommend+Social+Interaction）
        // 已由 renderer.js → ArticleFooter.render() 在 renderArticle 中直接固定顺序调用
        // 不再需要 app.js 另行插入
        var finalHTML = html;

        // Header Images（正文前）— 锚点: <!-- TRIPLE_DIVIDER -->
        if (typeof DRAW_RU_HEADER_IMAGES !== 'undefined' && typeof HeaderImagesRenderer !== 'undefined') {
            var hiHTML = HeaderImagesRenderer.render(DRAW_RU_HEADER_IMAGES, window.AppTheme.get());
            if (hiHTML) {
                var hiInserted = false;
                var hiMarker = '<!-- TRIPLE_DIVIDER -->';
                var hiIdx = finalHTML.indexOf(hiMarker);
                if (hiIdx !== -1) {
                    finalHTML = finalHTML.substring(0, hiIdx + hiMarker.length) + hiHTML + finalHTML.substring(hiIdx + hiMarker.length);
                    hiInserted = true;
                }
                if (!hiInserted) {
                    // v3.5.7: 安全回退 — 用根 section 的 > 作为插入点
                    // 只在 finalHTML 以 <section 开头时才尝试，避免破坏非 section 结构的 HTML
                    var rootSectionEnd = -1;
                    if (finalHTML.indexOf('<section') === 0) {
                        // 找到根 <section 后第一个 > 的位置
                        var tagClose = finalHTML.indexOf('>');
                        var nextSection = finalHTML.indexOf('<section', 1);
                        // 深度计数：确保找到的是根 section 的闭合 >，不是子 section 的
                        var depth = 1;
                        var pos = tagClose + 1;
                        while (pos < finalHTML.length && depth > 0) {
                            if (finalHTML.indexOf('<section', pos) === pos) { depth++; pos += 8; }
                            else if (finalHTML.indexOf('</section>', pos) === pos) { depth--; pos += 10; }
                            else { pos++; }
                        }
                        if (pos < finalHTML.length) {
                            finalHTML = finalHTML.substring(0, pos) + hiHTML + finalHTML.substring(pos);
                            hiInserted = true;
                            console.warn('[App] TRIPLE_DIVIDER anchor not found, header images inserted after root section');
                        }
                    }
                    if (!hiInserted) {
                        // 完全不明确的结构：放弃插入，保持原 HTML 不变
                        console.warn('[App] Cannot insert header images — no safe insertion point found, HTML kept intact');
                    }
                }
                if (!hiInserted) {
                    console.warn('[App] Cannot insert header images — no anchor found');
                }
            }
        }

        // v3.5.7: Footer 尾部由 renderer.js → ArticleFooter Pipeline 直接渲染
        // 不在 app.js 做字符串插入

        // 保存 HTML
        currentHTML = finalHTML;

        // 更新预览
        preview.innerHTML = finalHTML;

        showToast('\u2713 排版应用成功');
    } catch (err) {
        showToast('渲染失败：' + err.message);
        console.error('[App] Render error:', err);
    }
}

/**
 * 复制到剪贴板
 */
async function copyToClipboardHandler() {
    if (!currentHTML) {
        showToast('请先应用模板');
        return;
    }

    try {
        await copyHTML(currentHTML);

        var btn = document.getElementById('copyBtn');
        if (btn) {
            btn.innerHTML = '\u2713 已复制';
            btn.classList.add('copied');
        }

        showToast('已复制到剪贴板，请在公众号后台粘贴');

        setTimeout(function() {
            var b = document.getElementById('copyBtn');
            if (b) {
                b.innerHTML = '\uD83D\uDCCB 复制到公众号';
                b.classList.remove('copied');
            }
        }, 2000);
    } catch (err) {
        showToast('复制失败，请手动复制');
        console.error('[App] Copy error:', err);
    }
}

/**
 * 显示提示
 */
function showToast(msg) {
    var toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }
}

/**
 * 加载示例
 */
function loadExample() {
    var markdown = TemplateEngine.generateWithFields(currentTemplate);

    var editor = document.getElementById('editor');
    if (editor) {
        editor.value = markdown;
    }

    // 自动应用一次
    setTimeout(function() {
        applyTemplate();
    }, 100);
}

/**
 * 清空所有
 */
function clearAll() {
    var editor = document.getElementById('editor');
    var preview = document.getElementById('preview');

    if (editor) editor.value = '';
    if (preview) {
        preview.innerHTML = '<p style="color: #999; text-align: center; padding: 60px 0;">选择模板，粘贴 Markdown<br>点击「应用模板」查看效果</p>';
    }

    currentHTML = '';

    // 清空配置面板
    var configInputs = document.querySelectorAll('#form-container .form-input, #form-container .form-textarea');
    configInputs.forEach(function(input) {
        input.value = '';
    });

    // 清空图片预览
    var previews = document.querySelectorAll('#form-container .image-preview');
    previews.forEach(function(p) {
        p.innerHTML = '<span class="placeholder-text">图片预览区域</span>';
    });

    showToast('已清空');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
