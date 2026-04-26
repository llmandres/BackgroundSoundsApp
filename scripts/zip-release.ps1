# ZIPs dist/ (flat: exe, DLL, resources, launcher) to repo root for GitHub Releases
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Ver = (Get-Content (Join-Path $Root "VERSION") -Raw).Trim()
$Dist = Join-Path $Root "dist"
$exe = Join-Path $Dist "Noises Online.exe"
if (-not (Test-Path -LiteralPath $exe)) { throw "No build. Run: .\scripts\build.ps1" }
$all = @()
$all += Get-ChildItem -LiteralPath $Dist -Force
if ($all.Count -lt 1) { throw "dist/ is empty" }
$ZipName = "Noises-Online-v$Ver-Win32-x64.zip"
$ZipPath = Join-Path $Root $ZipName
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
Compress-Archive -Path $all -DestinationPath $ZipPath -CompressionLevel Optimal
Write-Host "ZIP: $ZipPath"
Get-Item -LiteralPath $ZipPath | Select-Object Name, Length, LastWriteTime
