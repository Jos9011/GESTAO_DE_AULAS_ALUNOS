@echo off
setlocal enabledelayedexpansion
title Gestor de Aulas - Backend (Java Spring Boot)
echo ========================================================
echo   Iniciando Backend Spring Boot (Porta 8080)...
echo ========================================================

:: 1. Verifica se 'java' já está no PATH do sistema
where java >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Java detectado no PATH do sistema.
    goto :check_maven
)

:: 2. Procura automaticamente em pastas conhecidas do usuário ou programas
if exist "%LOCALAPPDATA%\Programs\Java\jdk-25.0.2\bin\java.exe" (
    set "JAVA_HOME=%LOCALAPPDATA%\Programs\Java\jdk-25.0.2"
    set "PATH=!JAVA_HOME!\bin;!PATH!"
    echo [OK] Java detectado em %LOCALAPPDATA%\Programs\Java.
    goto :check_maven
)

for /d %%J in ("%LOCALAPPDATA%\Programs\Java\jdk*" "%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Eclipse Adoptium\jdk*") do (
    if exist "%%~J\bin\java.exe" (
        set "JAVA_HOME=%%~J"
        set "PATH=!JAVA_HOME!\bin;!PATH!"
        echo [OK] Java detectado em: %%~J
        goto :check_maven
    )
)

echo.
echo [AVISO] Java JDK nao foi localizado automaticamente neste computador.
echo Por favor, instale o Java (JDK 17 ou superior) em: https://adoptium.net/
echo.
pause
exit /b 1

:check_maven
:: Verifica se o Maven está disponível
where mvn >nul 2>nul
if %errorlevel% equ 0 (
    goto :run_backend
)

if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd" (
    set "PATH=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin;!PATH!"
    goto :run_backend
)

cd /d "%~dp0backend"
if exist "mvnw.cmd" (
    echo [OK] Usando Maven Wrapper local...
    call mvnw.cmd spring-boot:run
    goto :end
)

:run_backend
cd /d "%~dp0backend"
call mvn spring-boot:run

:end
pause
