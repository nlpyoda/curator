# Project TODOs

## Deployment & Build Issues

- **Netlify API Key Not Detected (Ongoing):**
  - **Symptom:** The `REACT_APP_CLAUDE_API_KEY` environment variable is not consistently picked up by the Netlify build, leading to the app thinking the key is missing, even when set in Netlify's UI or via `netlify env:set`.
  - **Current Status:** Debug logs have been added to `App.web.js` to display `process.env.REACT_APP_CLAUDE_API_KEY` at module load and in the UI. Need to verify after a "Clear cache and deploy site" on Netlify if the key is present in the frontend bundle.
  - **Next Steps:** 
    1. Perform "Clear cache and deploy site" on Netlify.
    2. Check live site's debug panel and browser console for API key presence.
    3. If the key is still not present, investigate Netlify build logs for when environment variables are injected and if the `npm run build:web` command is using them.
    4. Once confirmed working, remove the debug panel from `App.web.js`.

- **Expo Webpack Dependency Conflict (Temporary Workaround):**
  - **Issue:** The project uses `expo@~51.0.0` but `@expo/webpack-config@19.0.1` has a peer dependency on `expo@^49.0.7 || ^50.0.0-0`. This causes Netlify's default dependency installation to fail.
  - **Workaround:** The `build:web` script in `package.json` has been modified to `npm install --legacy-peer-deps && expo export:web && ...`. This allows npm to bypass the strict peer dependency check.
  - **Long-Term Solution:** `@expo/webpack-config` is deprecated. The recommended solution is to migrate the web bundling process from Expo Webpack to Expo Router, which uses Metro (consistent with native builds). This is a more significant change but aligns with Expo's current best practices.
    - Migration Guide: `https://docs.expo.dev/router/migrate/from-expo-webpack/`

## Feature Enhancements

- (Add future feature TODOs here)

## Bugs

- (Add any identified bugs here) 