@echo off
setlocal enabledelayedexpansion
title Gerador de Executavel (.EXE) - Gestor de Aulas Aluno
echo ========================================================
echo   Empacotador Nativo Windows (.EXE) - Gestor de Aulas (Aluno)
echo ========================================================
echo.

:: 1. Localizar Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" (
        set "PATH=%LOCALAPPDATA%\Programs\nodejs;!PATH!"
    ) else (
        echo [ERRO] Node.js nao encontrado. Execute 'configurar-ambiente.bat' primeiro.
        pause
        exit /b 1
    )
)

:: 2. Localizar JDK e jpackage
if not defined JAVA_HOME (
    for /d %%J in ("%LOCALAPPDATA%\Programs\Java\jdk*" "%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Eclipse Adoptium\jdk*") do (
        if exist "%%~J\bin\jpackage.exe" (
            set "JAVA_HOME=%%~J"
            set "PATH=%%~J\bin;!PATH!"
        )
    )
)

if not exist "!JAVA_HOME!\bin\jpackage.exe" (
    echo [ERRO] 'jpackage.exe' nao encontrado no JDK. Verifique a instalacao do Java 21+.
    pause
    exit /b 1
)

echo [1/4] Compilando Frontend React (Vite)...
cd /d "%~dp0frontend"
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao compilar frontend React.
    pause
    exit /b 1
)

echo.
echo [2/4] Integrando interface React ao Spring Boot...
cd /d "%~dp0"
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /s /e /y "frontend\dist\*" "backend\src\main\resources\static\" >nul

echo.
echo [3/4] Empacotando Backend Java (Maven)...
cd /d "%~dp0backend"
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao gerar arquivo JAR do Spring Boot.
    pause
    exit /b 1
)

echo.
echo [4/4] Gerando Executavel Windows Nativo com jpackage (.EXE)...
cd /d "%~dp0"
if exist "dist-app" rmdir /s /q "dist-app"

"!JAVA_HOME!\bin\jpackage.exe" ^
  --type app-image ^
  --input "backend\target" ^
  --name "GestorDeAulas-Aluno" ^
  --main-jar "backend-0.0.1-SNAPSHOT.jar" ^
  --dest "dist-app"

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCESSO! EXECUTAVEL DO ALUNO GERADO COM EXITO!
    echo ========================================================
    echo.
    echo O seu programa independente (.EXE) esta disponivel em:
    echo   dist-app\GestorDeAulas-Aluno\GestorDeAulas-Aluno.exe
    echo.
    echo Este executavel possui o Java Runtime embutido e pode
    echo rodar em qualquer computador Windows sem instalar nada!
    echo ========================================================
) else (
    echo [ERRO] Ocorreu uma falha durante o empacotamento com jpackage.
)

pause
