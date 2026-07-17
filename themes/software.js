/**
 * DrawRu 编辑器 - 软件分享主题
 * 
 * 基于秀米 TrafficMonitor 文章的精确参数
 * 参考: reference/xiumi-original.html
 */

const SOFTWARE_THEME = {
    name: 'software',
    description: '软件分享类文章模板',
    
    // ========== 颜色系统 ==========
    // 来源: grep -oP 'color:\s*rgb\([^)]+\)' xiumi-original.html | sort | uniq
    colors: {
        // 主金色 - 用于章节编号、小标题、强调
        gold: 'rgb(255, 189, 74)',
        goldHex: '#ffbd4a',
        
        // 浅蓝色 - 用于装饰线、背景、边框
        lightBlue: 'rgb(175, 207, 238)',
        lightBlueHex: '#afcfee',
        
        // 青色 - 用于点赞按钮
        cyan: 'rgb(68, 217, 230)',
        cyanHex: '#44d9e6',
        
        // 蓝色 - 用于在看按钮
        blue: 'rgb(46, 179, 255)',
        blueHex: '#2eb3ff',
        
        // 正文文字色
        text: 'rgb(62, 62, 62)',
        textHex: '#3e3e3e',
        
        // 白色 - 用于背景、隔离
        white: 'rgb(255, 255, 255)',
        whiteHex: '#ffffff'
    },
    
    // ========== 字体系统 ==========
    // 来源: grep -oP 'font-size:\s*\d+px' xiumi-original.html | sort | uniq
    fonts: {
        // 章节编号: 24px, 金色, 加粗, 下划线
        chapterNumber: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'gold',
            textDecoration: 'underline',
            letterSpacing: '0px'
        },
        
        // 小标题: 18px, 金色
        subtitle: {
            fontSize: '18px',
            color: 'gold'
        },
        
        // 正文: 16px, 行距1.6
        body: {
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'text'
        },
        
        // 标签/标注: 14px
        label: {
            fontSize: '14px',
            color: 'text'
        },
        
        // 特殊字体 - 庞门正道
        special: {
            fontFamily: 'PangMenZhengDao, sans-serif',
            fontSize: '18px'
        },
        
        // 公众号名/小标签: 12px, 庞门正道
        tag: {
            fontFamily: 'PangMenZhengDao, sans-serif',
            fontSize: '12px'
        },
        
        // 互动按钮: 17px
        actionButton: {
            fontSize: '17px'
        }
    },
    
    // ========== 间距系统 ==========
    // 来源: grep -oP 'margin:\s*[^;]+' xiumi-original.html | sort | uniq
    spacing: {
        // 根容器内边距
        containerPadding: '0px',
        
        // 段落间距
        paragraph: '0px 0px 16px',
        
        // 章节间距
        section: '10px 0px',
        
        // 图片外边距
        image: '10px 0px',
        
        // END 区域虚线上下间距
        endDivider: '14px 0px',
        
        // 双圆点分隔线上下间距
        sectionDivider: '0.5em 0px',
        
        // 组件内边距
        componentPadding: '0px'
    },
    
    // ========== 装饰系统 ==========
    decorations: {
        // 椭圆装饰
        // 来源: <section style="width: 52px; height: 29px; transform: rotateZ(328deg); border-radius: 50%"
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
        
        // ✦ 图标
        icon: {
            backgroundColor: 'white',
            padding: '0 4px',
            fontSize: '15px'
        },
        
        // 三色分隔线 - 圆点
        // 来源: <section style="width: 10px; height: 10px; border-radius: 95px"
        tripleDots: {
            size: '10px',
            borderRadius: '95px'
        },
        
        // 三色分隔线 - 虚线
        // 来源: border-top: 1px dashed rgb(175, 207, 238)
        tripleLine: {
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'lightBlue'
        },
        
        // 双圆点分隔线 - 圆点
        // 来源: <section style="width: 6px; height: 6px; border-radius: 100%; background-color: rgb(175, 207, 238)"
        sectionDots: {
            size: '6px',
            borderRadius: '100%',
            backgroundColor: 'lightBlue'
        },
        
        // 双圆点分隔线 - 虚线
        // 来源: border-bottom: 2px dotted rgb(175, 207, 238)
        sectionLine: {
            borderWidth: '2px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue'
        }
    },
    
    // ========== 边框系统 ==========
    borders: {
        // 图片边框
        // 来源: border-style: dotted; border-width: 2px; border-color: rgb(175, 207, 238); border-radius: 10px
        image: {
            borderWidth: '2px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue',
            borderRadius: '10px'
        },
        
        // 卡片边框（原创/分享等标签卡片）
        // 来源: border-style: dashed; border-width: 4px; border-color: rgb(175, 207, 238); border-top-left-radius: 15px
        card: {
            borderWidth: '4px',
            borderStyle: 'dashed',
            borderColor: 'lightBlue',
            borderRadius: '15px'
        },
        
        // END 区域虚线
        endLine: {
            borderWidth: '1px',
            borderStyle: 'dotted',
            borderColor: 'lightBlue'
        }
    },
    
    // ========== 布局系统 ==========
    layout: {
        // flex 基础参数
        flex: {
            flexFlow: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
        },
        
        // inline-block 基础参数
        inlineBlock: {
            verticalAlign: 'bottom'
        },
        
        // 图片容器
        imageContainer: {
            lineHeight: '0',
            textAlign: 'center'
        }
    },
    
    // ========== 组件参数 ==========
    components: {
        // 头部区域
        header: {
            sectionMargin: '10px 0px',
            iconMargin: '0px 0px 0px 10px'
        },
        
        // 底部 END
        footer: {
            textAlign: 'center',
            color: 'lightBlue',
            fontSize: '18px'
        },
        
        // 公众号名片
        profile: {
            // 使用微信原生组件，无自定义样式
        },
        
        // 互动按钮
        actionButtons: {
            buttonGap: '2%',  // 按钮间距
            buttonMinWidth: '10%'
        }
    },
    
    // ========== Footer 专用配置 ==========
    footer: {
        // 版权声明
        copyright: {
            year: '2026',
            author: 'DrawRu',
            supportedTypes: ['原创', '转载', 'AI生成', '整理'],
            type: '原创',
            fontSize: '12px',
            color: 'rgb(150, 150, 150)'
        },
        
        // 社交平台（延迟求值，运行时从 window.DRAW_RU_SOCIALS 读取）
        get socials() { return typeof window !== 'undefined' ? (window.DRAW_RU_SOCIALS || []) : []; },
        
        // 社交卡片
        socialCard: {
            borderColor: 'lightBlue',
            borderWidth: '2px',
            borderStyle: 'dotted',
            borderRadius: '10px',
            labelFontSize: '12px',
            labelBgColor: 'lightBlue',
            labelPadding: '5px'
        },
        
        // 社交间隔
        socialGap: '5%',
        
        // 底部三色分隔线
        bottomTripleDots: {
            size: '10px',
            borderRadius: '95px',
            margin: '0px 10px'
        },
        
        // 底部虚线
        bottomLine: {
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'lightBlue',
            margin: '0.5em 0px'
        }
    }
};

// 颜色快捷方法
SOFTWARE_THEME.getColor = function(colorName) {
    return this.colors[colorName] || this.colors.text;
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SOFTWARE_THEME;
}
