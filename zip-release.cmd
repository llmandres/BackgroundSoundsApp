@echo off
setlocal
cd /d "%~dp0"
echo [zip-release.cmd] Running PowerShell: scripts\zip-release.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\zip-release.ps1"
if %ERRORLEVEL% neq 0 (
  echo.
  echo zip-release failed with error %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo.
echo If successful, a Noises-Online-v*.zip file should be in this folder.
