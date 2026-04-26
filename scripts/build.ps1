# Windows build (Nativefier / Electron). Requires: npm i -g nativefier
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$OutParent = Join-Path $Root "dist"
$Css = Join-Path $Root "nativefier-assets\dark-theme.css"
$Ico = Join-Path $Root "nativefier-assets\app.ico"
if (-not (Test-Path -LiteralPath $Css)) { throw "Missing: $Css" }
if (-not (Test-Path -LiteralPath $Ico)) { throw "Missing: $Ico" }
if (-not (Get-Command nativefier -ErrorAction SilentlyContinue)) { throw "Install nativefier: npm install -g nativefier" }
$nfSub = "Noises Online-win32-x64"
if (Test-Path -LiteralPath $OutParent) { Remove-Item -LiteralPath $OutParent -Recurse -Force }
New-Item -ItemType Directory -Path $OutParent -Force | Out-Null
nativefier "https://noises.online" $OutParent `
	-n "Noises Online" `
	--width 1024 --height 768 `
	--background-color "#1a1d21" `
	-p win32 `
	--inject $Css --icon $Ico `
	--disable-gpu --single-instance --disk-cache-size 10485760 `
	--tray true
$built = Join-Path $OutParent $nfSub
$exe = Join-Path $built "Noises Online.exe"
if (-not (Test-Path -LiteralPath $exe)) { throw "Build incomplete: $built" }
Get-ChildItem -LiteralPath $built -Force | ForEach-Object { Move-Item -LiteralPath $_.FullName -Destination $OutParent -Force }
Remove-Item -LiteralPath $built -Recurse -Force
$exeFlat = Join-Path $OutParent "Noises Online.exe"
if (-not (Test-Path -LiteralPath $exeFlat)) { throw "Flatten failed, missing $exeFlat" }
$launcher = Join-Path $OutParent "Open-Noises-Online.bat"
@(
	'@echo off',
	'REM Double-click to start (all DLL/PAK and resources/ must stay next to Noises Online.exe).',
	'start "" "%~dp0Noises Online.exe"'
) | Set-Content -LiteralPath $launcher -Encoding ascii
Write-Host "Done: $exeFlat (same folder as resources/ and all DLLs)"
Write-Host "Shortcut: $launcher"
