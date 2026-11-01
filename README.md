# legcord-plugins

Plugins for [Legcord](https://github.com/Legcord/Legcord). Each plugin is a folder under `plugins/` with a `manifest.json` and CommonJS entry files. Legcord loads plugins from its user-data `plugins` directory.

## Channel Popout

Right-click a channel in the server or DM list and choose **Open in New Window**. The popout is a separate window on the same login, with the server list, channel list, and member list hidden so the chat fills the window. Opening the same channel again focuses the existing popout.

Legcord sends normal `window.open` links to the system browser. This plugin marks its own channel URL and, in the main process, opens only that URL in a new window.

The popout loads Legcord's preload, so Vencord (or whichever client mod is enabled), Legcord's window chrome, and your enabled themes plus Quick CSS come with it. Focusing the popout picks up theme changes made after it opened.

The popout is a second Discord session on the same account. Message notifications can show twice, and the window can appear under Settings, Devices.

### Install

Copy `plugins/channel-popout` to:

- Windows: `%APPDATA%\legcord\plugins\channel-popout`
- Portable Windows: `legcord-data\plugins\channel-popout` next to the executable
- macOS: `~/Library/Application Support/legcord/plugins/channel-popout`
- Linux: `~/.config/legcord/plugins/channel-popout`

The folder has to contain `manifest.json`, `main.js`, `renderer.js`, and `package.json`. Quit Legcord completely, including the tray icon, then start it again.

1. Discord settings, then Legcord Settings.
2. Turn on **Show experimental plugin menu**.
3. Open **Plugins** and enable **Channel Popout**.

Renderer changes apply on the next reload. Main-process changes apply when the plugin is reloaded or Legcord restarts.

Future plugins go in `plugins/<id>/`. Keep each plugin folder CommonJS (`"type": "commonjs"`). Legcord loads `main.js` with Node, and a parent `"type": "module"` package would break that.
