# ZIPs dist/ (flat: exe, DLL, resources, launcher) to repo root for GitHub Releases
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Ver = (Get-Content (Join-Path $Root "VERSION") -Raw).Trim()
$Dist = Join-Path $Root "dist"
$exe = Join-Path $Dist "Noises Online.exe"
if (-not (Test-Path -LiteralPath $exe)) { throw "No build. Run: .\scripts\build.ps1" }
$items = Get-ChildItem -LiteralPath $Dist -Force
if ($items.Count -lt 2) { throw "dist/ has too few files; run: .\scripts\build.ps1" }
$ZipName = "Noises-Online-v$Ver-Win32-x64.zip"
$ZipPath = Join-Path $Root $ZipName
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
# String paths (dist\*) are more reliable than object arrays; includes files + folders
$glob = Join-Path $Dist "*"
Compress-Archive -Path $glob -DestinationPath $ZipPath -CompressionLevel Optimal
$size = (Get-Item -LiteralPath $ZipPath).Length
$minBytes = 10 * 1MB
if ($size -lt $minBytes) { throw "ZIP is too small ($size bytes). Re-run build. Missing DLLs or resources?" }
$mb = [math]::Round($size / 1MB, 1)
Write-Host "ZIP: $ZipPath  ($mb MB)"
Get-Item -LiteralPath $ZipPath | Select-Object Name, Length, LastWriteTime
