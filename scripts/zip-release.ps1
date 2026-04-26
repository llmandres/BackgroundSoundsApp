# Crea un ZIP en la raíz del repo para subir a GitHub Releases (carpeta dist/ ya debe existir)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Ver = (Get-Content (Join-Path $Root "VERSION") -Raw).Trim()
$Source = Join-Path $Root "dist\Noises Online-win32-x64"
if (-not (Test-Path -LiteralPath (Join-Path $Source "Noises Online.exe"))) {
	throw "No hay build. Ejecuta primero: .\scripts\build.ps1"
}
$ZipName = "Noises-Online-v$Ver-Win32-x64.zip"
$ZipPath = Join-Path $Root $ZipName
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
Compress-Archive -Path $Source -DestinationPath $ZipPath -CompressionLevel Optimal
Write-Host "ZIP: $ZipPath"
Get-Item -LiteralPath $ZipPath | Select-Object Name, Length, LastWriteTime
