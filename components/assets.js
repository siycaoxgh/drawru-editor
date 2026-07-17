/**
 * 组件：SVG 资源库
 * 统一管理所有 SVG 图片资源
 */

const ASSETS = {
    // 装饰性 SVG
    ellipse: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='30'%3E%3Cellipse cx='25' cy='15' rx='24' ry='14' fill='none' stroke='%233e3e3e' stroke-width='1'/%3E%3C/svg%3E`,
    
    // 金色渐变线（用于标题装饰）
    goldLine: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='2'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23ffbd4a'/%3E%3Cstop offset='100%25' stop-color='%23ffbd4a' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='2' fill='url(%23g)'/%3E%3C/svg%3E`,
    
    // 虚线 SVG
    dash: {
        // 长虚线 80px
        long80: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='2'%3E%3Cline x1='0' y1='1' x2='80' y2='1' stroke='%23afcfee' stroke-width='2' stroke-dasharray='4,3'/%3E%3C/svg%3E`,
        // 中虚线 60px
        medium60: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='2'%3E%3Cline x1='0' y1='1' x2='60' y2='1' stroke='%23afcfee' stroke-width='2' stroke-dasharray='4,3'/%3E%3C/svg%3E`,
        // 长虚线 100px
        long100: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='2'%3E%3Cline x1='0' y1='1' x2='100' y2='1' stroke='%23afcfee' stroke-width='2' stroke-dasharray='4,3'/%3E%3C/svg%3E`
    },
    
    // 圆点 SVG
    dot: {
        // 青色圆点 10px
        cyan10: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%2344d9e6'/%3E%3C/svg%3E`,
        // 金色圆点 10px
        gold10: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23ffbd4a'/%3E%3C/svg%3E`,
        // 蓝色圆点 10px
        blue10: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%232eb3ff'/%3E%3C/svg%3E`,
        // 浅蓝圆点 6px
        light6: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Ccircle cx='3' cy='3' r='3' fill='%23afcfee'/%3E%3C/svg%3E`,
        // 青色圆点 6px
        cyan6: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Ccircle cx='3' cy='3' r='3' fill='%2344d9e6'/%3E%3C/svg%3E`,
        // 金色圆点 6px
        gold6: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Ccircle cx='3' cy='3' r='3' fill='%23ffbd4a'/%3E%3C/svg%3E`,
        // 蓝色圆点 6px
        blue6: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Ccircle cx='3' cy='3' r='3' fill='%232eb3ff'/%3E%3C/svg%3E`
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASSETS;
}
