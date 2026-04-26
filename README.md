# Noises Online (app de escritorio)

Empaquetado con [Nativefier](https://github.com/nativefier/nativefier): ventana 1024×768, tema oscuro inyectado, icono, optimización de caché, una sola instancia, aceleración GPU desactivada y cierre a la bandeja de sistema (como al cerrar la ventana el audio puede seguir en segundo plano).

**Sitio embebido:** [noises.online](https://noises.online) (enlace externo, no formamos parte de su proyecto).

## Requisitos para compilar

- Node.js y npm
- `npm install -g nativefier`

## Generar el ejecutable

En PowerShell, desde la raíz del repositorio:

```powershell
.\scripts\build.ps1
```

El resultado queda en `dist/Noises Online-win32-x64/Noises Online.exe`.

## Generar el ZIP para una Release (GitHub)

Con el build hecho:

```powershell
.\scripts\zip-release.ps1
```

Se crea en la raíz: `Noises-Online-v<VERSION>-Win32-x64.zip` (la versión se lee del archivo `VERSION`).

## Publicar en GitHub (un solo Release)

1. Crea un repositorio vacío en GitHub y añade el `origin`.
2. Sube el código (la carpeta `dist/` no se versiona; está en `.gitignore`).
3. Crea y sube un tag, por ejemplo `v1.0.0` (alineado con `VERSION`):

   ```powershell
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

4. Sube el ZIP: **Releases** → **Draft a new release** → elige el tag `v1.0.0` → adjunta el archivo `Noises-Online-v1.0.0-Win32-x64.zip` generado con `.\scripts\zip-release.ps1` → publica.

Si activas **GitHub Actions** en el repo, al publicar un tag `v*` el workflow en `.github/workflows/release.yml` intentará compilar en Windows y adjuntar el ZIP automáticamente (puede fallar en forks sin permisos; en ese caso usa la subida manual del paso 4).

## Contenido versionado

- `nativefier-assets/` — CSS inyectado e icono para la app.
- `scripts/` — build y empaquetado.
- `VERSION` — número de release (cambiar y etiquetar en git al publicar)
