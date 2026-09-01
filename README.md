# ReMemo — marketing site

Static marketing site for the ReMemo Android app. No build step, no dependencies:
plain HTML, one stylesheet, one small script.

```
index.html      The App (homepage)
features.html   Features + what is coming next
about.html      A Message from the Creator (same text as the in-app About)
contact.html    Email + what to write about
assets/
  css/style.css design system
  js/main.js    mobile nav + scroll reveal
  img/          logo, phone mockups, screenshots, line art
```

## Running it

Open `index.html` in a browser. That is genuinely all — there is nothing to install.

To serve it locally over HTTP (closer to production):

```bash
npx serve .          # or: python -m http.server 8000
```

## Publishing

Any static host works. Drag the folder onto **Netlify Drop**, or point
**Vercel**, **Cloudflare Pages** or **GitHub Pages** at this repository. No build
command, no output directory — the repository root *is* the site.

## Design system

Taken from the app itself (`src/constants/theme.ts` in the ReMemo repo) so the
site and the product look like one thing:

| Token | Value | Role in the app |
|---|---|---|
| `--ink` | `#113A5D` | `onPrimaryContainer` — headings |
| `--primary` | `#3D6186` | `primary` — buttons, links |
| `--primary-soft` | `#81A4CD` | `primaryContainer` |
| `--sky` | `#D1E4FF` | the app icon's background |
| `--yellow` | `#F3DE8A` | `secondaryContainer` — the Stars badge |
| `--warm` | `#FDF6F1` | warm section background |

Headings are **Poppins**, body copy is **Volkhov** — the same pair the app uses
(`Fonts.heading` / `Fonts.body`), loaded from Google Fonts.

The decorative line drawings are the app's own minimalist character art
(`assets/illustrations/friends/*/line/`), which are black-on-transparent masks —
so opacity alone controls how present they feel.

## Notes

- The **Download** links point at
  `https://play.google.com/store/apps/details?id=com.rememo.app`. That page only
  resolves publicly once the app is out of closed testing.
- The hero phone cross-fades between the app's two visual styles (minimalist and
  default) on a 12-second loop. It holds still for anyone who has "reduce
  motion" turned on.
- Screenshots are captured from the release build with Android's status-bar demo
  mode (`adb shell am broadcast -a com.android.systemui.demo`), which is why the
  clock reads 9:30 with full signal on every one. Retake them the same way.
- The app is still in closed testing, so every Download button carries a
  "Releasing soon on Google Play" note. Remove those `.note` lines on the day it
  goes public.
- The six languages listed are the app's own UI languages
  (`src/i18n/locales/` in the ReMemo repo). The website itself is English only.
- Copy came from the supplied draft; obvious typos were corrected
  (`heathy` → `healthy`, `Costumize` → `Customize`, `jave` → `have`,
  `throughtout` → `throughout`).
