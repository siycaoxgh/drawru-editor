# DrawRu 隐私与公开仓库说明

## COS 地址

COS 图片 URL 本身通常不是访问凭据；如果对象桶允许公开读取，知道 URL 的人就可以读取对应对象。公开仓库不应提交私有桶的访问密钥、签名 URL 或管理 API 凭据。

DrawRu 的公开代码和文档只使用示例 URL，例如：

```text
https://example.com/assets/sample.jpg
```

真实 COS URL 请通过本地配置、编辑器表单或未提交的私有文件提供。不要把 `SecretId`、`SecretKey`、长期签名 URL、Token 或密码写入仓库。

## 不采用 URL 加密或混淆

URL 编码、Base64 和字符串拆分都不是安全措施，浏览器和微信公众号仍需要得到可访问的原始地址，也很容易还原。因此项目采用占位 URL 脱敏，而不是加密混淆。

## 上传前检查

- 使用 `rg` 搜索 `SecretId`、`SecretKey`、`token`、`password`、`Bearer` 等敏感字段。
- 检查示例图片 URL 是否误指向个人 COS 桶。
- 确认 `reference/`、`archive/` 和本地测试产物不进入正式仓库。
- 如果密钥曾经提交过，应立即在对应平台撤销并重新生成；仅删除文件不能清除 Git 历史中的泄露内容。
