# Genera el ejecutable Windows (Nativefier). Requiere: npm i -g nativefier
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$OutParent = Join-Path $Root "dist"
$Css = Join-Path $Root "nativefier-assets\dark-theme.css"
$Ico = Join-Path $Root "nativefier-assets\app.ico"
if (-not (Test-Path -LiteralPath $Css)) { throw "No existe: $Css" }
if (-not (Test-Path -LiteralPath $Ico)) { throw "No existe: $Ico" }
if (-not (Get-Command nativefier -ErrorAction SilentlyContinue)) { throw "Instala Nativefier: npm install -g nativefier" }
New-Item -ItemType Directory -Path $OutParent -Force | Out-Null
nativefier "https://noises.online" $OutParent `
	-n "Noises Online" `
	--width 1024 --height 768 `
	--background-color "#1a1d21" `
	-p win32 `
	--inject $Css --icon $Ico `
	--disable-gpu --single-instance --disk-cache-size 10485760 `
	--tray true
$built = Join-Path $OutParent "Noises Online-win32-x64"
if (-not (Test-Path -LiteralPath (Join-Path $built "Noises Online.exe"))) { throw "Build incompleto: $built" }
Write-Host "Listo: $built"
