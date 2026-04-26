# Noises Online — Windows desktop shell

## What this is (and is not)

This repository is **not** the official *Noises Online* app and **I am not the author** of the website, sounds, or service.

It is a **community-made desktop build** of the public website **[noises.online](https://noises.online)**, which is created and run by its author, **Stéphane Pigeon** (see the site for credits, donations, and terms). I only **wrap** that site in a local window using [Nativefier](https://github.com/nativefier/nativefier) (Electron) plus some custom assets (e.g. dark theme overlay, window size, system tray). All in-browser behaviour, audio, and rights remain those of the **original web project**.

## Build requirements

- Node.js and npm
- `npm install -g nativefier`

## Build the Windows executable

From a PowerShell prompt at the repository root:

```powershell
.\scripts\build.ps1
```

Output:

- `dist/Noises Online-win32-x64/Noises Online.exe` (must stay with the rest of that folder — Electron needs the DLLs and `resources/` next to it).
- `dist/Open-Noises-Online.bat` — double-click this for a quick start; it launches the `.exe` above. The same `.bat` is placed at the **root of the release ZIP** next to the folder, so users can run the app without drilling into subfolders.

## Create a release ZIP (for GitHub Releases)

After a successful build:

```powershell
.\scripts\zip-release.ps1
```

This creates a file at the repo root, e.g. `Noises-Online-v1.0.0-Win32-x64.zip` (version is read from the `VERSION` file).

## Publishing on GitHub

1. Create a new repository and add it as `origin`.
2. Push the code. The `dist/` and packaged app folders are listed in `.gitignore` and are not committed.
3. Create and push a version tag, e.g. `v1.0.0`, matching `VERSION`.
4. Either attach the ZIP to a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) manually, or use the workflow in `.github/workflows/release.yml` (pushes a `v*` tag to trigger a Windows build and upload, if Actions is enabled).

## Versioned in this repo

- `nativefier-assets/` — Injected CSS and icon used only for the shell (not the site’s own assets).
- `scripts/` — `build.ps1` and `zip-release.ps1`
- `VERSION` — Release number for tags and the ZIP name
