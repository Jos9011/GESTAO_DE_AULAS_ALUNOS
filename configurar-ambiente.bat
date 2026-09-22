@echo off
setlocal enabledelayedexpansion
title Verificando e Configurando Dependencias do Sistema
echo =======================================================================
echo   GESTOR DE AULAS - VERIFICACAO AUTOMATICA DE AMBIENTE
echo =======================================================================
echo.

:: ---------------------------------------------------------
:: 1. VERIFICAR JAVA (JDK)
:: ---------------------------------------------------------
echo [1/3] Verificando Java (JDK)...

where java >nul 2>nul
if %errorlevel% equ 0 (
    echo    [OK] Java encontrado no PATH do sistema.
    goto :check_node
)

if exist "%LOCALAPPDATA%\Programs\Java" (
    for /d %%J in ("%LOCALAPPDATA%\Programs\Java\*") do (
        if exist "%%~J\bin\java.exe" (
            set "JAVA_HOME=%%~J"
            set "PATH=%%~J\bin;!PATH!"
            echo    [OK] Java detectado em: %%~J
            goto :check_node
        )
    )
)

if exist "%ProgramFiles%\Java" (
    for /d %%J in ("%ProgramFiles%\Java\*") do (
        if exist "%%~J\bin\java.exe" (
            set "JAVA_HOME=%%~J"
            set "PATH=%%~J\bin;!PATH!"
            echo    [OK] Java detectado em: %%~J
            goto :check_node
        )
    )
)

:: Se chegou aqui, precisa baixar o Java automaticamente
echo    [!] Java JDK nao foi encontrado neste computador.
echo    [!] Baixando e configurando Microsoft OpenJDK 21 LTS portatil...
echo    Aguarde o download e extracao, isso e feito apenas uma vez...
echo.

if not exist "%LOCALAPPDATA%\Programs\Java" mkdir "%LOCALAPPDATA%\Programs\Java"
set "JDK_ZIP=%TEMP%\jdk21_auto.zip"

echo    Baixando JDK 21...
curl.exe -L "https://aka.ms/download-jdk/microsoft-jdk-21.0.6-windows-x64.zip" -o "%JDK_ZIP%"

if not exist "%JDK_ZIP%" (
    echo    [ERRO] Falha ao baixar o Java automaticamente.
    echo    Por favor, instale o JDK manualmente em https://adoptium.net/
    pause
    exit /b 1
)

echo    Extraindo Java...
tar.exe -xf "%JDK_ZIP%" -C "%LOCALAPPDATA%\Programs\Java"
del /f /q "%JDK_ZIP%" >nul 2>nul

for /d %%D in ("%LOCALAPPDATA%\Programs\Java\jdk-21*") do (
    set "JAVA_HOME=%%~D"
    set "PATH=%%~D\bin;!PATH!"
)
echo    [OK] Java 21 configurado com sucesso!

:: ---------------------------------------------------------
:: 2. VERIFICAR NODE.JS
:: ---------------------------------------------------------
:check_node
echo.
echo [2/3] Verificando Node.js e NPM...

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo    [OK] Node.js encontrado no PATH do sistema.
    goto :check_frontend
)

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;!PATH!"
    echo    [OK] Node.js detectado em %LOCALAPPDATA%\Programs\nodejs.
    goto :check_frontend
)

if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;!PATH!"
    echo    [OK] Node.js detectado em Program Files.
    goto :check_frontend
)

:: Se chegou aqui, precisa baixar o Node.js automaticamente
echo    [!] Node.js nao foi encontrado neste computador.
echo    [!] Baixando e configurando Node.js LTS portatil...
echo.

if not exist "%LOCALAPPDATA%\Programs\nodejs" mkdir "%LOCALAPPDATA%\Programs\nodejs"
set "NODE_ZIP=%TEMP%\node_auto.zip"

echo    Baixando Node.js LTS...
curl.exe -L "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip" -o "%NODE_ZIP%"

if not exist "%NODE_ZIP%" (
    echo    [ERRO] Falha ao baixar o Node.js automaticamente.
    echo    Por favor, instale o Node.js em https://nodejs.org/
    pause
    exit /b 1
)

echo    Extraindo Node.js...
tar.exe -xf "%NODE_ZIP%" -C "%LOCALAPPDATA%\Programs\nodejs" --strip-components=1
del /f /q "%NODE_ZIP%" >nul 2>nul
set "PATH=%LOCALAPPDATA%\Programs\nodejs;!PATH!"
echo    [OK] Node.js configurado com sucesso!

:: ---------------------------------------------------------
:: 3. VERIFICAR DEPENDÊNCIAS DO FRONTEND
:: ---------------------------------------------------------
:check_frontend
echo.
echo [3/3] Verificando dependencias do Frontend React...
cd /d "%~dp0frontend"
if not exist "node_modules" goto :install_npm
echo    [OK] Dependencias do React ja instaladas.
goto :done_env

:install_npm
echo    [!] Pasta node_modules nao encontrada.
echo    Instalando pacotes do React automaticamente via npm install...
call npm install
echo    [OK] Pacotes do frontend instalados com sucesso!

:done_env
echo.
echo =======================================================================
echo   TUDO PRONTO! AMBIENTE VALIDADO COM SUCESSO.
echo =======================================================================
ping 127.0.0.1 -n 2 >nul

