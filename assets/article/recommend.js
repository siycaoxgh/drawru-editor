/**
 * 推荐文章区域 — 静态配置
 * DrawRu v3.5.6
 *
 * 配置说明：
 * - title  必填，推荐标题
 * - image  必填，COS 图片链接（HTTPS）
 * - url    可选，推荐文章链接（空串 = 仅图片+标题）
 *
 * 支持 1-4 个推荐位，超过 4 个只取前 4。
 * 有 title 且 image 非空的项才会渲染。
 */

var DRAW_RU_RECOMMENDS = [
    {
        title: "我们分享 我们共享 我们自由",
        image: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg",
        url: ""
    },
    {
        title: "发现更多精彩内容",
        image: "https://image-xaocen-1303881255.cos.ap-shanghai.myqcloud.com/202210290944229.jpg",
        url: ""
    },
    {
        title: "",
        image: "",
        url: ""
    },
    {
        title: "",
        image: "",
        url: ""
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DRAW_RU_RECOMMENDS;
}
