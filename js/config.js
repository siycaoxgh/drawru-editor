/**
 * DrawRu 编辑器 - 配置文件
 * 微信公众号 Markdown 编译器
 */

const CONFIG = {
    // 默认颜色主题
    colors: {
        gold: '#ffbd4a',
        light: '#afcfee',
        cyan: '#44d9e6',
        blue: '#2eb3ff',
        text: '#3e3e3e'
    },
    
    // 字体配置
    fonts: {
        primary: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
        mono: "Consolas, Monaco, 'Courier New', monospace"
    },
    
    // 导出配置
    export: {
        tag: 'section',
        backgroundTransparent: true
    },
    
    // ==========================================
    // 样式模板 - 统一管理重复样式
    // ==========================================
    styles: {
        // 基础透明背景（必须加在每个元素上）
        transparent: 'background: transparent;',
        
        // 容器样式
        container: "background-color: transparent !important; padding: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;",
        
        // 通用 section 基础样式
        sectionBase: 'margin: 0 0 10px 0; color: #3e3e3e; line-height: 1.7; background: transparent;',
        
        // 章节标题行
        titleRow: 'margin-bottom: 16px; display: flex; align-items: center; background: transparent;',
        
        // 章节编号
        titleNum: 'font-size: 24px; font-weight: bold; color: #ffbd4a; margin-right: 12px; line-height: 1; background: transparent;',
        
        // 小标题
        subtitle: 'font-size: 16px; font-weight: bold; color: #ffbd4a; margin-bottom: 12px; background: transparent;',
        
        // 图片容器
        imageContainer: 'margin: 12px 0; text-align: center; background: transparent;',
        
        // 图片样式
        image: 'max-width: 100%; border: 2px dotted #afcfee; border-radius: 8px; display: block; height: auto; margin: 0 auto; background: transparent;',
        
        // 信息列表行
        infoRow: 'display: flex; margin-bottom: 8px; font-size: 15px; line-height: 1.6; background: transparent;',
        
        // 信息标签
        infoLabel: 'color: #666; width: 90px; flex-shrink: 0; background: transparent;',
        
        // 信息值
        infoValue: 'color: #3e3e3e; font-weight: 500; background: transparent;',
        
        // 引用
        quote: 'margin: 10px 0; padding: 12px 16px; background: #afcfee20; border-left: 3px solid #afcfee; color: #3e3e3e; line-height: 1.7; background: transparent;',
        
        // 分割线容器
        dividerCenter: 'text-align: center; margin: 10px 0; background: transparent;',
        
        // 分割线元素
        dividerLine: 'vertical-align: middle; display: inline-block; background: transparent;',
        
        // 文字装饰
        diamond: 'margin: 5px 0 10px 20px; color: #ffbd4a; background: transparent;',
        
        // 底部 END
        end: 'text-align: center; color: #999; font-size: 13px; margin: 16px 0; background: transparent;'
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
