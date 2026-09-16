@echo off
chcp 65001 >nul
title Chu Gia Security - AI Chatbot Server
echo.
echo ============================================================
echo   Chu Gia Security - AI Chatbot Server
echo ============================================================
echo.
echo   Dang khoi dong server...
echo   Trang Chu AI: http://localhost:8000/
echo   Trang Web:    https://chugia.shop/
echo   Du Toan:      http://localhost:8000/du-toan.html
echo   Combo Wi-Fi:  http://localhost:8000/combo-wifi.html
echo.
echo   Nhan Ctrl+C de dung server
echo ============================================================
echo.

cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
python server.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo [LOI] Khong the khoi dong server.
    echo Kiem tra Python da cai dat chua: python --version
    echo.
    pause
)
