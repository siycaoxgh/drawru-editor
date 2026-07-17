/**
 * DrawRu 主题管理器（浏览器版）
 * 
 * 统一管理主题，提供全局访问入口
 * 
 * 使用方式：
 *   - window.AppTheme.get()      // 获取当前主题
 *   - window.AppTheme.set(name)  // 切换主题
 *   - window.AppTheme.getColor('gold')  // 获取颜色
 */

const ThemeManager = {
    // 可用主题
    themes: {
        default: null,    // 由 themes/default.js 填充
        software: null   // 由 themes/software.js 填充
    },
    
    // 当前主题名称
    current: 'software',
    
    /**
     * 初始化主题管理器
     * 必须在所有主题文件加载后调用
     */
    init() {
        console.log('[ThemeManager] Initializing...');
        
        // 从全局变量收集主题
        if (typeof DEFAULT_THEME !== 'undefined') {
            this.themes.default = DEFAULT_THEME;
            console.log('[ThemeManager] Loaded: DEFAULT_THEME');
        }
        
        if (typeof SOFTWARE_THEME !== 'undefined') {
            this.themes.software = SOFTWARE_THEME;
            console.log('[ThemeManager] Loaded: SOFTWARE_THEME');
        }
        
        // 默认使用 software 主题
        if (!this.themes[this.current]) {
            // 回退到 default
            this.current = 'default';
        }
        
        if (!this.themes[this.current]) {
            // 回退到第一个可用主题
            const keys = Object.keys(this.themes);
            if (keys.length > 0) {
                this.current = keys[0];
            }
        }
        
        // 挂载到全局
        window.AppTheme = this;
        
        console.log(`[ThemeManager] Current theme: ${this.current}`);
        console.log('[ThemeManager] OK');
        
        return this;
    },
    
    /**
     * 获取当前主题
     */
    get() {
        return this.themes[this.current] || this.themes.default || this.themes.software;
    },
    
    /**
     * 切换主题
     * @param {string} name - 主题名称
     */
    set(name) {
        if (this.themes[name]) {
            this.current = name;
            console.log(`[ThemeManager] Theme switched to: ${name}`);
        } else {
            console.warn(`[ThemeManager] Theme not found: ${name}`);
        }
    },
    
    /**
     * 获取颜色
     * @param {string} colorName - 颜色名称
     */
    getColor(colorName) {
        const theme = this.get();
        if (theme && theme.getColor) {
            return theme.getColor(colorName);
        }
        return '#333333';
    }
};

// 导出（兼容 Node.js）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
