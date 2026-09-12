# 部署说明

网站通过白名单构建到 `dist/`。本地调试文件、参考源码和重复资源不会进入线上产物。

## 本地检查

```powershell
npm run build
npm run check
python -m http.server 8000 --directory dist
```

访问 `http://localhost:8000/` 和 `http://localhost:8000/about-template/`。

## Cloudflare Workers & Pages

连接 GitHub 仓库后使用以下设置：

- 生产分支：`master`
- 构建命令：`npm run build`
- 部署命令：`npx wrangler deploy`
- Node.js：`22`

`wrangler.jsonc` 将 `dist/` 配置为静态资源目录。Cloudflare 会在每次推送后自动构建并发布；`_headers` 提供安全响应头，`_redirects` 将 `/about` 重定向到 3D 作品集。
