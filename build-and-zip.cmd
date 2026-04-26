@echo off
setlocal
cd /d "%~dp0"
echo Running build, then zip...
call "%~dp0build.cmd" || exit /b 1
call "%~dp0zip-release.cmd" || exit /b 1
echo.
echo All done. Look for: Noises-Online-v*-Win32-x64.zip
pause
