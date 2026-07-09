/**
 * DrawRu 编辑器 - 默认主题
 * 
 * 软件分享主题的简化版本
 * 当没有指定特定模板时使用
 */

const DEFAULT_THEME = {
    name: 'default',
    description: '默认主题（软件分享风格）',
    
    // ========== 颜色系统 ==========
    colors: {
        gold: 'rgb(255, 189, 74)',
        goldHex: '#ffbd4a',
        lightBlue: 'rgb(175, 207, 238)',
        lightBlueHex: '#afcfee',
        cyan: 'rgb(68, 217, 230)',
        cyanHex: '#44d9e6',
        blue: 'rgb(46, 179, 255)',
        blueHex: '#2eb3ff',
        text: 'rgb(62, 62, 62)',
        textHex: '#3e3e3e',
        white: 'rgb(255, 255, 255)',
        whiteHex: '#ffffff'
    },
    
    // ========== 字体系统 ==========
    fonts: {
        chapterNumber: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'gold',
            textDecoration: 'underline',
            letterSpacing: '0px'
        },
        subtitle: {
            fontSize: '18px',
            color: 'gold'
        },
        body: {
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'text'
        },
        label: {
            fontSize: '14px',
            color: 'text'
        },
        special: {
            fontFamily: 'PangMenZhengDao, sans-serif',
            fontSize: '18px'
        },
        tag: {
            fontFamily: 'PangMenZhengDao, sans-serif',
            fontSize: '12px'
        },
        actionButton: {
            fontSize: '17px'
        }
    },
    
    // ========== 间距系统 ==========
    spacing: {
        containerPadding: '0px',
        paragraph: '0px 0px 16px',
        section: '10px 0px',
        image: '10px 0px',
        endDivider: '14px 0px',
        sectionDivider: '0.5em 0px',
        componentPadding: '0px'
    },
    
    // ========== 装饰系统 ==========
    decorations: {
        ellipse: {
            width: '52px',
            height: '29px',
            rotate: '328deg',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'text',
            borderRadius: '50%',
            backgroundColor: 'transparent'
        },
        icon: {
            backgroundColor: 'white',
            padding: '0 4px',
            fontSize: '15px'
        },
        tripleDots: {
            size: '10px',
            borderRadius: '95px'
        },
        tripleLine: {
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'lightBlue'
        },
        sectionDots: {
            size: '6px',
            borderRadius: '100%',
            backgroundColor: 'lightBlue'
        },
        sectionLine: {
            borderWidth: '2px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue'
        }
    },
    
    // ========== 边框系统 ==========
    borders: {
        image: {
            borderWidth: '2px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue',
            borderRadius: '10px'
        },
        card: {
            borderWidth: '4px',
            borderStyle: 'dashed',
            borderColor: 'lightBlue',
            borderRadius: '15px'
        },
        endLine: {
            borderWidth: '1px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue'
        }
    },
    
    // ========== 布局系统 ==========
    layout: {
        flex: {
            flexFlow: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
        },
        inlineBlock: {
            verticalAlign: 'bottom'
        },
        imageContainer: {
            lineHeight: '0',
            textAlign: 'center'
        }
    },
    
    // ========== 组件参数 ==========
    components: {
        header: {
            sectionMargin: '10px 0px',
            iconMargin: '0px 0px 0px 10px'
        },
        footer: {
            textAlign: 'center',
            color: 'lightBlue',
            fontSize: '18px'
        },
        profile: {},
        actionButtons: {
            buttonGap: '2%',
            buttonMinWidth: '10%'
        }
    }
};

// 颜色快捷方法
DEFAULT_THEME.getColor = function(colorName) {
    return this.colors[colorName] || this.colors.text;
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEFAULT_THEME;
}
