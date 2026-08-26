@echo off
title 个人网站本地预览
start "个人网站服务器" /min python -m http.server 8000 --directory "%~dp0"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8000/index.html
