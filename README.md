# Barriam Electricals: Website

A single-page site for **Barriam Electricals & General Services Ltd**, Sirisia Market, Bungoma County.
Tagline: **"Power done right."**

It is built with plain HTML, CSS and vanilla JS. There is no build step and no framework. Together the three files are under 50 KB before compression.

```
index.html        Page markup, SEO meta, Open Graph, LocalBusiness/Electrician schema
styles.css        Design tokens + all styles (mobile-first)
script.js         Nav, scroll progress line, reveals, testimonials, form validation
assets/
  favicon.svg     Logo mark
  og-image.jpg    1200×630 social share image
MASTER_PROMPT.md  Client brief pulled from the business plan
```

---

## Design system

### Colors (3 hues)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0B0F` | Page base |
| `--surface` / `--surface-2` | `#111318` / `#171A21` | Cards, form, inputs |
| `--line` / `--line-strong` | `#23262F` / `#353945` | 1px hairlines, borders |
| `--text` | `#F2F3F5` | Headlines, body (17:1 contrast) |
| `--text-muted` | `#9BA1AD` | Secondary copy (7.4:1) |
| `--text-dim` | `#868C98` | Labels, tags (5.6:1) |
| `--accent` | `#D4FF00` | Volt yellow: CTAs, icons, glow, current line |

All text pairs pass WCAG AA. Accent buttons use dark text (`--accent-ink`) on the yellow.

### Typography: Sora (300 / 400 / 600)
| Token | Size | Use |
|---|---|---|
| `--fs-2xl` | 48 → 128px | Hero headline, weight 300, tracking −0.055em |
| `--fs-xl` | 32 → 56px | Section headlines and quotes |
| `--fs-num` | 64 → 120px | Stat numerals (accent + glow) |
| `--fs-lg` | 20 → 24px | Card and step titles |
| `--fs-md` | 18px | Lead paragraphs |
| `--fs-base` / `--fs-sm` | 16 / 14px | Body / card text |
| `--fs-xs` | 12px | UPPERCASE tags, letter-spacing 0.2em |

### Spacing
The scale uses a 4px base: `--sp-1` (4px) to `--sp-10` (128px). Section padding is fluid, `--section-y` (80 → 160px). The container is 1200px wide (1320px at 1440px and up), with a 16 / 32 / 48px gutter.

### Components
- **Buttons:** `.btn--primary` (yellow pill, glows on hover) and `.btn--ghost` (hairline border that turns yellow on hover). Minimum height is 48px.
- **Tag:** a small uppercase label with a short glowing accent line.
- **Service card:** a hairline border; on hover it lifts, glows, and its top edge lights up.
- **Stat:** a large yellow numeral over a hairline rule.
- **Timeline:** vertical on mobile, horizontal from 768px. The line "charges" with current when it scrolls into view.
- **Project tile:** a 4:3 media area with a placeholder grid pattern, ready for an `<img>`.
- **Quote rotator:** one quote at a time with a crossfade. It pauses on hover or focus and has dot controls.
- **Form:** inline validation with a success state.
- **Current line:** shows scroll progress. It is a top bar on mobile and a vertical rail at the left edge on desktop.
- **Mobile call bar:** a "Call 0711 175 656" button fixed at the bottom of the screen below 1024px.

**Re-theming:** change `--accent` (and `--accent-glow` / `--accent-soft`) in `:root`. For example, cyan is `#00E5FF` with `rgba(0,229,255,.35)`.

---

## Setup

1. Open `index.html` in a browser. Everything works locally. For best results, serve the folder with a local server such as `npx serve .` or VS Code Live Server.
2. **Connect the form:**
   1. Create a free form at [formspree.io](https://formspree.io).
   2. Set the recipient to `ennbarriam@gmail.com`.
   3. In `index.html`, replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"` with the ID Formspree gives you.

   Until you do this, the form runs in **demo mode**: it validates and shows the success message, but sends nothing.
3. **Before launch, replace these placeholders:**
   - **Testimonials:** use real customer quotes, with their permission. The current quotes are placeholders, marked in the HTML.
   - **Project tiles:** add real photos (WebP, about 800×600, with `loading="lazy"`). Instructions are in the HTML comment above the Projects section.
   - **Facebook and Instagram links:** replace `#` in the footer.
   - **Opening hours:** currently Mon–Sat 7:30 am – 8:00 pm. Update them in the Contact section and in the JSON-LD `openingHoursSpecification`.
   - **Domain:** replace `barriamelectricals.co.ke` in the canonical, Open Graph and schema tags with your real domain.

## Deployment (free options)

- **Netlify:** drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages / Vercel:** connect a Git repo. There is no build command, and the output directory is `/`.
- **GitHub Pages:** push the folder to a repo, then go to Settings → Pages → Deploy from branch.
- **Custom `.co.ke` domain:** register it through a KENIC-accredited registrar, then point its DNS to your host.

After deploying, set up a **Google Business Profile** for "Barriam Electricals, Sirisia" and link it to the site. It brings more local calls than anything else.

## Checks done
- Breakpoints are 375 / 768 / 1024 / 1440px, and nothing scrolls horizontally.
- The page is keyboard navigable, with a skip link, visible focus rings, an Escape-to-close menu and labelled form errors.
- `prefers-reduced-motion` turns off all animation and auto-rotation and shows all content immediately.
- Without JavaScript, the page and its content stay fully visible.
