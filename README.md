# Mark Ablai — portfolio

Static site. No build step; one vendored dependency (Lenis, for the smooth scroll). Ink-and-watercolor map theme with four scroll scenes:
cloud dive → watercolor wash → koi projects → scale zoom onto the fish's back (feed) → surface to the ship (contact).

## Files you'll actually edit

| File | What it controls |
|---|---|
| `data/feed.json` | Ship's log entries. Add a new object at the **top** of the array to post. |
| `data/content.json` | Name, tagline, subline, email, LinkedIn/GitHub URLs, project cards. |
| `assets/resume.pdf` | Drop your resume here (exact filename). Embeds on the resume page automatically. |
| `homelab.html` | Long-form homelab writeup — edit the text directly. |

Everything else (HTML/CSS/JS) is the engine; you shouldn't need to touch it.

### Adding a feed post (the whole workflow)

1. Open `data/feed.json`
2. Add at the top of the list:
```json
{ "date": "JUL 2026", "text": "Passed Security+." },
```
3. Commit and push. Done — live in about a minute.

## Before going live — placeholders to replace

- `data/content.json`: `email`, `linkedin`, `github` are placeholders.
- `assets/resume.pdf`: not included — add yours.
- Two project cards link to `#` until you write those pages/posts.

## Deploy to GitHub Pages (free)

1. Create a repo named `YOUR-USERNAME.github.io` (site lives at that URL), or any repo name (site lives at `YOUR-USERNAME.github.io/REPO-NAME`).
2. From this folder:
```bash
git init
git add .
git commit -m "Portfolio v1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Live in ~1 minute at the URL shown on that page.

Custom domain later: buy one (Porkbun/Cloudflare, ~$10/yr), add it in Settings → Pages, and set the DNS records GitHub shows you.

## Preview locally

`fetch()` for the JSON files doesn't work over `file://`, so run a tiny server:

```bash
cd portfolio
python -m http.server 8000
# open http://localhost:8000
```

(Without a server the page still renders using built-in fallback content.)

## How the scenes work (if you ever do want to tinker)

- `js/main.js` — one scroll handler drives all transforms. Each scene reads its progress (0→1) from its stage's scroll position.
- `js/smooth-scroll.js` — [Lenis](https://github.com/darkroomengineering/lenis) (darkroom.engineering) eases the scroll
  itself, and the scenes are driven off that eased position, so the transforms glide instead of stepping with the
  wheel. Feel knobs (`lerp`, wheel/touch multipliers) are the first few lines of that file — lower `lerp` = longer,
  heavier glide. `js/vendor/lenis.min.js` is the vendored library (MIT, v1.3.26); don't edit it, replace it.
- Scene heights: `.hero-stage` (220vh) and `.zoom-stage` (260vh) in `css/style.css` control how long each transition lasts. Bigger = slower.
- `prefers-reduced-motion` collapses all scenes to static layouts and turns the smooth scroll off automatically.
