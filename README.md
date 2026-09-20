# ns-website-WIP
Live @: https://ns-portfolio-wip.vercel.app

This is a website to display all my passions and experience. Currently a work in progress.

## Wii Message Board & themes

Open the envelope in the bottom-right corner of the Wii Menu. “Today’s
Accomplishments” records time in each open channel while the tab is visible.
Daily history (up to 90 days), installed themes, and the active theme are saved
in this browser's local storage (`wii-portfolio-mods-v1`). If storage is blocked,
the experience still works for the current session.

Opening the mysterious LetterBomb letter activates **WarioWare** and adds the
Homebrew Channel. Homebrew is an installation-only terminal accepting `help`, `list`,
`install <theme>`, and `clear`. Select installed themes using the **NS** button
on the Wii Menu, which opens the Theme Editor. Wii Classic and Dark Mode are
available from the start; LetterBomb unlocks WarioWare and the Homebrew installer.
Theme IDs: `wii`, `dark`, `wario`, `mario`.
The active theme carries through channel interiors, the Mii editor, Discovery
room, Skills board, Message Board, and Homebrew terminal. Switching back to Wii
Classic restores the original channel styling.
These are simulated local theme packages; no system software is installed.

Visual references:
- [Nintendo's original Super Mario Bros.](https://www.nintendo.com/en-gb/Games/NES/Super-Mario-Bros-803853.html): Mario menu palette and overworld scenery; clouds and landscape are locally drawn SVGs.
- [Wii Message Board / daily play history](https://www.wiibrew.org/wiki/Message_Board)
- [LetterBomb](https://wiibrew.org/wiki/LetterBomb)
- [Official WarioWare character site](https://www.nintendo.com/jp/character/wario/en/index.html)
- `public/wii/wario.png`: Nintendo's WarioWare main-visual character artwork,
  from the official site's `assets/images/top/main_visual/wario_PC.png`.
- `public/wii/letterbomb.png`: user-supplied `letterbombWii.png`.

Verification: `npm run build`. Browser checks cover the LetterBomb unlock,
all package install/apply actions, returning to Wii Classic, invalid commands,
reload persistence, per-channel activity, and desktop/mobile layouts.

Homebrew tile artwork: user-supplied `homebrewchannel.jpg`, stored as
`public/wii/homebrew-channel.jpg`.

Previously used banner (`public/wii/homebrew-channel.png`): [Homebrew channel logo](https://commons.wikimedia.org/wiki/File:Homebrew_channel_logo.png),
graphics by souLLy, banner layout/animation by Marcan, composition by drmr,
[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). The original
image is retained locally but is no longer used for the channel tile.

Peach castle portrait: `public/wii/peach-portrait.png`, original Nintendo EAD Super Mario 64 stained-glass texture, via [Super Mario Wiki](https://www.mariowiki.com/File:SM64_Asset_Texture_Castle_(Stained_Glass).png).
