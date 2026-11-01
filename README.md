# AVEVA Telemetry Field Engineering Guide (UAE Edition)
Offline PWA with searchable field tips for SCADA engineers in Dubai and the Northern Emirates. No build step, no Node.js.

## Upload to GitHub from an iPhone (Safari only)
1. In the app, tap **Download project ZIP**, or save the ZIP you were sent, into Files.
2. Open Files, tap the ZIP to unzip it into a folder.
3. In Safari open github.com, sign in, tap **+ > New repository**, name it, create it.
4. Tap **uploading an existing file**, then **choose your files** > Browse, and select the unzipped files and folders. (Safari may only accept files one folder level at a time. Repeat per folder, keeping paths via **Add file > Upload files** inside each folder.)
5. Commit. Then **Settings > Pages > Deploy from branch: main / root**.
6. Open the Pages link in Safari, tap Share > **Add to Home Screen**. Open it once online so it caches for offline use.

## Important: GitHub web upload flattens folders
GitHub's website will not unzip a ZIP, and Safari uploads can lose folder paths. Most reliable on iPhone: use the free **Working Copy** app (clone/create repo, import the unzipped folder, commit, push). Alternative: upload files folder by folder, typing the path (e.g. `docs/dnp3-sav5.md`) in GitHub's **Create new file** name box.

## Add tips
Edit the `TIPS` array in `script.js`: `[categoryIndex, title, body, code]`.

## Deploy with GitHub Actions
The ZIP includes `.github/workflows/pages.yml`. In the repo go to **Settings > Pages > Source: GitHub Actions**, then push once. Runs queue instead of colliding. Hidden files (`.github`, `.gitignore`, `.env.example`) are not served by Pages, so the in-app ZIP export leaves them out; use this ZIP for the complete set.
