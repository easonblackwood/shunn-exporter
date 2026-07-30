# Shunn Export

An [Obsidian](https://obsidian.md) plugin that exports your notes as properly formatted manuscript DOCX files, ready to attach to a short fiction submission.

The plugin implements [William Shunn's Proper Manuscript Format](https://www.shunn.net/format/) — the industry standard for short fiction submissions to speculative fiction magazines and beyond.

---

## What it does

Every mechanical formatting requirement is handled automatically:

- **Font and size** — Courier New, Courier, or Times New Roman at 12pt throughout
- **Line spacing** — double-spaced
- **Paragraph indent** — ½ inch first-line indent on every body paragraph
- **Margins** — 1 inch on all four sides
- **First-page header** — contact block (name, address, phone, email) upper-left; approximate word count upper-right, rounded to the nearest 100
- **Running header** — `Surname / Title / Page` flush right from page 2 onwards, suppressed on page 1
- **Title page** — title bold and centred roughly one-third down the page, byline below it
- **YAML frontmatter** — stripped before export
- **Scene breaks** — `#`, `* * *`, `---`, or `***` on their own line all become a centred `#`
- **Scene labels** — Markdown headings (`## Part Two`) become bold centred text with an automatic `#` break before them
- **Italics** — `*word*` or `_word_` becomes italic (or underline, via toggle)
- **Em dashes** — `--` is converted to `—`

---

## Installation

### Via Obsidian Community Plugins

Search for **Shunn Export** in Settings → Community plugins → Browse.

### Manual

Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/easonblackwood/shunn-exporter/releases/latest) and copy them to your vault at `.obsidian/plugins/shunn-export/`.

---

## Usage

Open the sidebar via the ribbon icon or Command Palette (`Open Shunn Exporter`). Fill in your details — these persist between sessions.

| Setting | Notes |
|---|---|
| Title | Used on the title page and in the running header |
| Author Name | Legal name or pen name |
| Font | Courier New (default), Courier, or Times New Roman |
| Include Address | Toggles the contact block on the first-page header |
| Abbreviate Header Title | Use a shorter title in the running header |
| Show Italics as Underline | For markets that prefer underlining |
| Anonymous Manuscript | Removes byline and surname from header (blind submissions) |

Hit **Export** to generate the DOCX. The file saves to your downloads folder named after the story title.

---

## Writing conventions

The exporter handles all formatting, but a few simple conventions in your Obsidian document are required:

**Paragraph breaks** — separate paragraphs with a blank line between them (standard Obsidian behaviour).

**Scene breaks** — put `#`, `* * *`, or `---` on its own line with a blank line before and after.

**Italics** — use `*word*` or `_word_`. Do not use `**bold**` — there is no bold in Shunn format, and double asterisks will appear literally in the output.

**Em dashes** — type `--` and the exporter converts it to `—`.

**Smart quotes** — enable Obsidian's smart quotes (Settings → Editor → Smart quotes) so curly quotes are used in the source file.

**One space between sentences** — the exporter does not normalise spacing; two spaces will carry through.

---

## Links

- [Shunn Proper Manuscript Format](https://www.shunn.net/format/)
- [Eason Blackwood](https://www.easonblackwood.com)
