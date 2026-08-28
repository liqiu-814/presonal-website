# -*- coding: utf-8 -*-
"""本地开发服务器：禁用缓存，并保留明确的作品集旧地址。"""
import http.server
import os
import socketserver

PORT = 3000
DIR = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # 只为明确的旧地址提供兜底；其他未知路径保持标准 404。
        p = self.path.split("?", 1)[0].split("#", 1)[0]
        fs_path = super().translate_path(self.path)
        if not os.path.exists(fs_path) and p.rstrip("/").lower() == "/about":
            self.path = "/about-template/index.html"
        return super().send_head()


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    with ReusableTCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
        print(f"Serving {DIR}")
        print(f"http://localhost:{PORT}")
        httpd.serve_forever()
