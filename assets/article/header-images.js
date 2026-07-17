/**
 * 文章顶部引导 + 固定图片模块
 * DrawRu v3.5.5-beta
 *
 * 配置：替换 src 为你的 COS 图片 URL
 * 空数组 = 不渲染此模块
 */

var DRAW_RU_HEADER_IMAGES = [
    {
        src: "https://example.com/Windows.webp",
        alt: "",
        width: "",
        height: "",
        link: ""
    },
    {
        src: "https://example.com/Android.webp",
        alt: "",
        width: "",
        height: "",
        link: ""
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DRAW_RU_HEADER_IMAGES;
}
