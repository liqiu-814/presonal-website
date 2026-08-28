@echo off
title 个人网站本地预览
start "个人网站服务器" /min python "%~dp0server.py"
timeout /t 2 /nobreak >nul
start "" http://localhost:3000/index.html
