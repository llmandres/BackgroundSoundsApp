@echo off
setlocal
cd /d "%~dp0"
echo [build.cmd] Running PowerShell: scripts\build.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build.ps1"
if %ERRORLEVEL% neq 0 (
  echo.
  echo Build failed with error %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo.
echo Build finished. Next run: zip-release.cmd
