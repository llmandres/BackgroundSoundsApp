# Noises Online — Windows desktop shell

## What this is (and is not)

This repository is **not** the official *Noises Online* app and **I am not the author** of the website, sounds, or service.

It is a **community-made desktop build** of the public website **[noises.online](https://noises.online)**, which is created and run by its author, **Stéphane Pigeon** (see the site for credits, donations, and terms). I only **wrap** that site in a local window using [Nativefier](https://github.com/nativefier/nativefier) (Electron) plus some custom assets (e.g. dark theme overlay, window size, system tray). All in-browser behaviour, audio, and rights remain those of the **original web project**.

## Build requirements

- Node.js and npm
- `npm install -g nativefier`

## Build the Windows executable

**If you use Command Prompt (cmd)** — the black window where the prompt looks like `C:\...>` — **do not** run `.\scripts\build.ps1` directly. Cmd does not run PowerShell scripts, so nothing will be built. Use one of these instead:

- **Easiest:** double-click **`build-and-zip.cmd`** in the project folder, or in cmd: `build-and-zip.cmd`  
- Or, from the repo root in cmd, run in order: **`build.cmd`** then **`zip-release.cmd`**
- Or call PowerShell explicitly:  
  `powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\build.ps1"`

**From a PowerShell prompt** (prompt often starts with `PS `), at the repository root:

```powershell
.\scripts\build.ps1
```

Output (everything in **`dist/`** — no subfolder, so the `.exe` is at `dist/Noises Online.exe` next to the DLLs and `resources/`):

- `dist/Noises Online.exe` — do **not** move this file alone; keep it with every file that Nativefier placed in the same directory.
- `dist/Open-Noises-Online.bat` — optional double-click helper (launches the `.exe` in the same folder). The **release ZIP** zips the whole of `dist/`, so the user sees the `.exe` and all dependencies at the top level of the archive.

**Open a shared link / share yours:** a **circular button** (link icon) sits at the **bottom-left** of the window. Click it to **slide open** a small panel: paste a noises.online URL and **Open**. **Copy my link** builds the same URL the site uses for sharing (`https://noises.online/player.php?g=…`), not the address bar. **Pin dialog** opens the site’s own share prompt if you prefer. **Hide**, **Escape**, or click the **FAB** again to close. You can still start the app with: `"Noises Online.exe" "https://noises.online/…"` (quoted).

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
