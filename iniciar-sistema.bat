@echo off
title Gestor de Aulas & HD Externo - Inicializador
echo =======================================================================
echo   GESTOR DE AULAS E HD EXTERNO - INICIALIZADOR COMPLETO
echo =======================================================================
echo.

:: 1. Executa a checagem e instalacao automatica de dependencias se necessario
call "%~dp0configurar-ambiente.bat"
if %errorlevel% neq 0 (
    echo [ERRO] Nao foi possivel configurar o ambiente.
    pause
    exit /b 1
)

echo.
echo Iniciando os servidores...

:: 2. Inicia o backend Spring Boot em uma janela dedicada
start "Backend Java Spring Boot (Porta 8080)" cmd /k "%~dp0iniciar-backend.bat"

:: Aguarda 4 segundos para o Spring Boot comecar a subir
ping 127.0.0.1 -n 5 >nul

:: 3. Inicia o frontend React em outra janela dedicada
start "Frontend React Vite (Porta 5173)" cmd /k "%~dp0iniciar-frontend.bat"

echo.
echo =======================================================================
echo   SISTEMA INICIADO COM SUCESSO!
echo.
echo   - Backend API: http://localhost:8080/api/explorador/discos
echo   - Frontend UI: http://localhost:5173
echo =======================================================================
echo.
