Nice — I made a ready-to-use **Nano Banana Pro Skill** you can drop into your workflow. It includes: when to use, how to use, prompt templates for different placeholder types (hero, product, avatar, illustration, pattern, screenshot), recommended `generationConfig` settings, accessibility alt-text generation, filenames/`srcset` guidance, and safe-content notes. Paste the whole thing into your skill system or save as `nano-banana-pro-skill.md` / `.yaml` as you prefer.

````yaml
---
name: nano-banana-pro-placeholder-images
description: |
  Create consistent, production-ready placeholder images for frontend and landing-page designs
  (hero banners, product cards, avatars, abstract backgrounds, UI screenshots, icons).
  Uses Gemini image generation (Nano Banana Pro / gemini-3-pro-image-preview) via the
  provided streamGenerateContent API call. Returns image + short caption & accessibility alt text.
---

# Nano Banana Pro — Placeholder Image Skill

## Purpose
Generate high-quality placeholder images quickly and consistently for UI mockups, landing pages,
and frontend designs. Provide multiple aspect ratios, responsive versions, useful filenames,
and alt text so the assets are ready to plug into a design system.

## When to use this skill
- Creating hero/billboard placeholders for landing pages.
- Producing consistent product-card thumbnails or gallery placeholders.
- Generating user avatars and author headshots (stylized, not real people).
- Making abstract/gradient backgrounds or pattern tiles.
- Producing screenshot-like UI mockups (wireframe style).
- Creating simple illustrative icons or decorative illustrations.

## How the skill works (steps)
1. Receive the `placeholder_type` and `context` (short design instruction).
2. Pick an `aspect_ratio` and `size` based on `placeholder_type`.
3. Build a concise visual prompt using the templates below.
4. Call the Gemini image generation API (example curl shown).
5. Return: image file (or data URL), suggested filename, `srcset` sizes, caption, and generated `alt` text.

## Default conventions & naming
- Filenames: `{page}-{component}-{width}w-{variant}.webp`
  - Example: `home-hero-1200w-grad.webp`, `product-card-400w-1.webp`
- Variants: `1`, `2`, `subtle`, `bold`
- Sizes to produce per request (recommended responsive set):
  - small: 400w
  - medium: 800w
  - large: 1200w (1K / default)
- Output format: prefer `webp` (lossy, good compression) or use `png` when transparency needed.

## Default generationConfig (recommended)
```json
"generationConfig": {
  "responseModalities": ["IMAGE", "TEXT"],
  "imageConfig": {
    "aspectRatio": "16:9",
    "imageSize": "1K",
    "personGeneration": "none"
  }
}
````

* `aspectRatio`: choose from `"16:9"`, `"4:3"`, `"3:2"`, `"1:1"`, `"9:16"` depending on component.
* `imageSize`: `"1K"` default for design; use `"2K"` only for hero images if needed.
* `personGeneration`: `"none"`, `"stylized"`, or `"realistic"` — use `"none"` or `"stylized"` for placeholder avatars (avoid real-person likeness).

## Prompt templates (fill `<<...>>` with specifics)

Use short, concrete prompts. Keep aesthetic + functional tokens:

### 1) Hero Banner (wide)

`"A visually striking hero banner for <<product_or_service>> in a <<mood>> style, clean composition, room for headline and button on the left, subtle depth, high contrast, soft gradient background, minimal illustration or abstract shapes, no text."`

Recommended: `aspectRatio: "16:9"`, `imageSize: "1K"`

### 2) Product Card / Thumbnail (square or 3:2)

`"Product placeholder: clean studio-style product card for <<category>>, centered subject, soft drop shadow, neutral gradient background, subtle reflection, minimal props, white space for overlay label."`

Recommended: `aspectRatio: "1:1"` or `"3:2"`, `imageSize: "800"`

### 3) Avatar / Author Headshot (stylized)

`"Stylized vector avatar for a user profile, friendly expression, flat colors, simple geometric shapes, neutral background, no text, cartoon-ish but professional, no real-person likeness."`

Recommended: `aspectRatio: "1:1"`, `personGeneration: "stylized"`

### 4) Abstract Background / Decorative Pattern

`"Abstract background for website hero: soft flowing shapes, pastel palette of <<colors>>, subtle grain texture, non-repeating pattern, high-res, no focal point, seamless feel."`

Recommended: `aspectRatio: depends (16:9 or 1:1)`, consider generating a tile version for repetition.

### 5) UI Wireframe Screenshot (placeholder)

`"Clean UI mockup placeholder for a landing page screenshot: simplified wireframe blocks, hero area, two-column layout, grey scale tones, rounded buttons, no real content, looks like a blurred screenshot placeholder."`

Recommended: `aspectRatio: "16:9"`, `imageSize: "1K"`

### 6) Icon / Decorative Illustration (small)

`"Minimal decorative illustration: single line-art icon representing <<concept>>, simple strokes, centered, transparent background, scalable."`

Recommended: `imageSize: "400"`, use `png` or `svg` (if supported).

## Example request.json (ready-to-edit)

Below is the templated JSON you can write to `request.json`. Replace `INSERT_INPUT_HERE` with one of the prompt templates (escape JSON as needed). Adjust `aspectRatio` and `personGeneration` per type.

```json
{
  "contents":[
    {
      "role":"user",
      "parts":[
        {
          "text":"A visually striking hero banner for an analytics SaaS, modern and optimistic mood, clean composition, room for headline and CTA on the left, subtle depth, soft teal-to-purple gradient, minimal abstract shapes, no text."
        }
      ]
    }
  ],
  "generationConfig":{
    "responseModalities":["IMAGE","TEXT"],
    "imageConfig":{
      "aspectRatio":"16:9",
      "imageSize":"1K",
      "personGeneration":"none"
    }
  },
  "tools":[]
}
```

### Example curl (adapted from your snippet)

```bash
#!/bin/bash
set -e -E

GEMINI_API_KEY="$GEMINI_API_KEY"
MODEL_ID="gemini-3-pro-image-preview"
GENERATE_CONTENT_API="streamGenerateContent"
# request.json contains the JSON above or similar
curl -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d '@request.json'
```

## Output schema (what this skill should return)

* `image` — binary or data URL (one or multiple sizes)
* `filename` — suggested file name (see naming conventions)
* `srcset` — `[{url, width}]` for responsive images
* `alt` — generated accessibility text (one short sentence)
* `caption` — short caption / hint for designers (1–2 sentences)
* `variant` — descriptive tag (`subtle`, `bold`, `tile`, `avatar`, etc.)

## Auto-generated alt text rules

* Keep ≤ 125 characters.
* Include the function of the image and essential visual facts.

  * Example hero alt: `"Hero background: teal-to-purple gradient with abstract floating shapes for analytics SaaS."`
  * Example avatar alt: `"Stylized user avatar with geometric shapes and warm colors."`

## Prompt engineering tips

* Start with the use-case (hero, card, avatar).
* Specify mood, palette, and composition (left room for text, centered subject, etc).
* Add `no text`, `no watermark`, `no logos` to avoid unwanted overlays.
* For avatars: use `personGeneration: stylized` and explicit `no real-person likeness`.
* For patterns: request `tileable`, `seamless` if you plan to repeat.
* Limit descriptors per prompt to avoid conflicting style instructions.

## Accessibility & legal / safety notes

* Do not generate images that depict real people without explicit consent or source photos.
* Avoid generating brand logos, copyrighted characters, or trademarked designs as placeholders.
* If the design will be used publicly, pick `stylized` or abstract imagery for avatars rather than realistic faces.
* Add `no nudity`, `no graphic violence`, and `no hate symbols` to the prompt if you want an extra safety guard.

## Example short presets (key => prompt + config)

* `hero-bold`:

  * prompt: hero banner template with `mood: bold`, `palette: deep blues and orange accent`
  * aspectRatio: `16:9`, imageSize: `1K`
* `product-thumb`:

  * prompt: product card template with neutral background
  * aspectRatio: `1:1`, imageSize: `800`
* `avatar-stylized`:

  * prompt: avatar template
  * aspectRatio: `1:1`, imageSize: `400`, personGeneration: `stylized`
* `pattern-seamless`:

  * prompt: abstract background with `tileable` keyword
  * aspectRatio: `1:1`, imageSize: `1K`

## Implementation notes for frontend devs

* Generate the 3 responsive sizes for each image and store them with the naming convention.
* Use `srcset` and `sizes` to serve appropriate image for device width.
* If you need placeholders at build-time, run the skill in a build script (node/python) and store assets in `public/` or CDN.
* For runtime placeholders (during prototyping), request images on-demand with cache headers.

---

# Quick copy-ready example (short)

* Name: `hero-analytics-teal-grad`
* Prompt (JSON `text`):
  `"A visually striking hero banner for an analytics SaaS, modern and optimistic mood, clean composition, room for headline and CTA on the left, subtle depth, soft teal-to-purple gradient, minimal abstract shapes, no text, no logos."`
* generationConfig: aspectRatio `16:9`, imageSize `1K`, personGeneration `none`

