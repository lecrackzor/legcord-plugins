const assert = require("node:assert/strict");
const test = require("node:test");
const { parsePopoutRequest } = require("../plugins/channel-popout/main.js");
const { channelFromProps } = require("../plugins/channel-popout/renderer.js");

const CHANNEL = "123456789012345678";
const GUILD = "234567890123456789";

test("accepts a marked stable channel url and strips the marker", () => {
    const parsed = parsePopoutRequest(
        `https://discord.com/channels/${GUILD}/${CHANNEL}?legcord_channel_popout=1`,
    );
    assert.deepEqual(parsed, {
        channelId: CHANNEL,
        loadUrl: `https://discord.com/channels/${GUILD}/${CHANNEL}`,
    });
});

test("keeps a message id in the path and uses the channel id as the window key", () => {
    const message = "345678901234567890";
    const parsed = parsePopoutRequest(
        `https://ptb.discord.com/channels/@me/${CHANNEL}/${message}?legcord_channel_popout=1`,
    );
    assert.equal(parsed.channelId, CHANNEL);
    assert.equal(parsed.loadUrl, `https://ptb.discord.com/channels/@me/${CHANNEL}/${message}`);
});

test("matches the main window chrome for overlay mica", () => {
    const { popoutChrome } = require("../plugins/channel-popout/main.js");
    const chrome = popoutChrome(
        { windowStyle: "overlay", transparency: "modern", windowMaterial: "mica", overlayButtonColor: "#121214" },
        "win32",
    );
    assert.equal(chrome.frame, true);
    assert.equal(chrome.backgroundMaterial, "mica");
    assert.equal(chrome.titleBarStyle, "hidden");
    assert.equal(chrome.titleBarOverlay.height, 30);
    assert.equal(chrome.titleBarOverlay.color, "#121214");
});

test("rejects a theme path that leaves the theme folder", () => {
    const path = require("node:path");
    const { safeThemeFile } = require("../plugins/channel-popout/main.js");
    const dir = path.join("C:\\themes", "my-theme");
    assert.equal(safeThemeFile(dir, "src.css").endsWith(`${path.sep}src.css`), true);
    assert.equal(safeThemeFile(dir, "../settings.json"), null);
    assert.equal(safeThemeFile(dir, "C:\\Windows\\notepad.exe"), null);
});

test("reads a guild or DM channel from a context menu", () => {
    assert.deepEqual(channelFromProps({ channel: { id: "123456789012345678", type: 0, guild_id: "234567890123456789" } }), {
        guildId: "234567890123456789",
        channelId: "123456789012345678",
    });
    assert.equal(channelFromProps({ channel: { id: "123456789012345678", type: 1 } }).guildId, "@me");
    assert.equal(channelFromProps({ channel: { id: "123456789012345678", type: 0, author: {} } }), null);
});

test("rejects unmarked, non-discord, and non-channel urls", () => {
    assert.equal(
        parsePopoutRequest(`https://discord.com/channels/${GUILD}/${CHANNEL}`),
        null,
    );
    assert.equal(
        parsePopoutRequest(`https://example.com/channels/${GUILD}/${CHANNEL}?legcord_channel_popout=1`),
        null,
    );
    assert.equal(parsePopoutRequest("https://discord.com/app?legcord_channel_popout=1"), null);
    assert.equal(parsePopoutRequest("not a url"), null);
});
