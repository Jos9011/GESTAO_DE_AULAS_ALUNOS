@echo off
setlocal enabledelayedexpansion
title Gestor de Aulas - Frontend (React + Vite)
echo ========================================================
echo   Iniciando Frontend React Vite (Porta 5173)...
echo ========================================================

:: 1. Verifica se 'node' já está no PATH do sistema
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detectado no PATH do sistema.
    goto :check_modules
)

:: 2. Procura em pastas de instalação comuns
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;!PATH!"
    echo [OK] Node.js detectado em %LOCALAPPDATA%\Programs\nodejs.
    goto :check_modules
)

if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;!PATH!"
    echo [OK] Node.js detectado em Program Files.
    goto :check_modules
)

echo.
echo [AVISO] Node.js nao foi localizado neste computador.
echo Por favor, instale o Node.js em: https://nodejs.org/
echo.
pause
exit /b 1

:check_modules
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [INFO] Pasta node_modules nao encontrada.
    echo Instalando pacotes do React pela primeira vez neste computador...
    call npm install
)

npm run dev
pause
