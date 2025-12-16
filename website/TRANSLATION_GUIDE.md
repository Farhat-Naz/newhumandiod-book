# Auto-Translation Guide

This guide explains how to automatically translate your Docusaurus documentation into multiple languages using LibreTranslate (100% free!).

## Quick Start

### Translate to Spanish
```bash
npm run translate:es
```

### Translate to All Languages
```bash
npm run translate:all
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run translate:es` | Translate to Spanish only |
| `npm run translate:fr` | Translate to French only |
| `npm run translate:de` | Translate to German only |
| `npm run translate:all` | Translate to all configured languages |
| `npm run translate -- es fr` | Translate to specific languages |

## Supported Languages

The translation script supports all languages configured in `docusaurus.config.ts`:

- 🇪🇸 **Spanish** (`es`)
- 🇫🇷 **French** (`fr`)
- 🇩🇪 **German** (`de`)
- 🇨🇳 **Chinese** (`zh`)
- 🇸🇦 **Arabic** (`ar`)
- 🇵🇰 **Urdu** (`ur`)
- 🇵🇹 **Portuguese** (`pt`)
- 🇯🇵 **Japanese** (`ja`)
- 🇰🇷 **Korean** (`ko`)

## How It Works

The auto-translation script:

1. **Scans** all markdown files in the `docs/` directory
2. **Translates** content using LibreTranslate API (free, no API key needed!)
3. **Preserves**:
   - Code blocks and inline code
   - Links and images
   - Markdown formatting
   - Frontmatter structure
4. **Saves** translated files to `i18n/{locale}/docusaurus-plugin-content-docs/current/`
5. **Respects** rate limits with automatic delays

## Translation Process

### Step 1: Run Translation

Choose a language to start with (Spanish is recommended for testing):

```bash
npm run translate:es
```

**Expected output:**
```
🌍 Auto-Translate Docusaurus Documentation

Using LibreTranslate - 100% Free!

Found 25 documentation files
Target languages: Spanish

📝 Translating to Spanish (es)...

  Translating: intro.md...
  ✓ Saved to: i18n/es/.../current/intro.md
  Translating: chapter-1-basics.md...
  ✓ Saved to: i18n/es/.../current/chapter-1-basics.md
  ...

===================================================
✅ Translation Complete!

Total files: 25
Successfully translated: 25
Failed: 0
===================================================
```

### Step 2: Review Translations

Check the translated files in:
```
i18n/
├── es/
│   └── docusaurus-plugin-content-docs/
│       └── current/
│           ├── intro.md
│           ├── module-1/
│           └── module-2/
├── fr/
└── de/
```

### Step 3: Enable Language Switcher

Edit `docusaurus.config.ts` and uncomment the locale dropdown:

```typescript
items: [
  // ... other items
  {
    type: 'localeDropdown',  // ← Uncomment this
    position: 'right',
  },
  // ...
],
```

### Step 4: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm start
```

### Step 5: Test Language Switching

1. Open http://localhost:3000/
2. Click the language dropdown in the navbar
3. Select a language (e.g., Español)
4. Verify the content is translated

## Advanced Usage

### Translate Specific Languages

```bash
# Translate to Spanish and French only
npm run translate -- es fr

# Translate to German, Japanese, and Korean
npm run translate -- de ja ko
```

### Custom Translation Script

The translation script is located at `scripts/translate-docs.js`. You can customize:

- API endpoint (for self-hosted LibreTranslate)
- Translation delays (to adjust speed vs rate limits)
- File filtering (to exclude certain files)
- Chunk sizes (for large documents)

## Translation Quality

### What's Translated Well ✅
- Headings and paragraphs
- Lists and tables
- Frontmatter (titles, descriptions)
- Navigation text

### What's Preserved 🔒
- Code blocks (not translated)
- File paths and URLs
- Command examples
- Technical terms in code

### Manual Review Recommended 📝
- Technical terminology
- Product/brand names
- Acronyms and abbreviations
- Context-specific phrases

## Updating Translations

When you update your English documentation:

1. **Re-run the translation script** for affected languages:
   ```bash
   npm run translate:es
   ```

2. The script will **overwrite** existing translations

3. **Review changes** before committing

## Performance Tips

### For Faster Translation

1. **Translate one language at a time**:
   ```bash
   npm run translate:es  # Fast
   ```

2. **Avoid translating all languages at once** (takes ~5-10 minutes per language)

### For Production

1. **Self-host LibreTranslate** for:
   - Faster translation
   - No rate limits
   - Better privacy

2. **Update the API URL** in `scripts/translate-docs.js`:
   ```javascript
   const LIBRETRANSLATE_API_URL = 'https://your-server.com/translate';
   ```

## Troubleshooting

### Translation Fails

**Problem**: Script shows errors or timeouts

**Solutions**:
1. Check internet connection
2. Increase delays in script (edit line with `sleep(300)`)
3. Try again later (public API may be busy)
4. Consider self-hosting LibreTranslate

### Incomplete Translations

**Problem**: Some content is in English

**Causes**:
- Code blocks (intentionally not translated)
- API timeout (try re-running)
- Rate limiting (script automatically handles this)

**Solution**: Re-run the script for that language

### Build Errors

**Problem**: `npm run build` fails after translation

**Causes**:
- Broken markdown syntax
- Invalid frontmatter

**Solution**:
1. Check error message for specific file
2. Review and fix that translated file
3. Re-run build

## File Structure

After translation, your project structure will be:

```
website/
├── docs/                    # Original English docs
│   ├── intro.md
│   ├── module-1/
│   └── module-2/
├── i18n/                    # Translated docs
│   ├── es/
│   │   └── docusaurus-plugin-content-docs/
│   │       └── current/     # Spanish translations
│   │           ├── intro.md
│   │           ├── module-1/
│   │           └── module-2/
│   ├── fr/                  # French translations
│   └── de/                  # German translations
├── scripts/
│   └── translate-docs.js    # Translation script
└── docusaurus.config.ts     # Language configuration
```

## Best Practices

1. **Start with one language** (Spanish recommended for testing)
2. **Review translations** before enabling language switcher
3. **Update all languages** when changing English docs
4. **Commit translations to git** (they're static files)
5. **Test each language** in the browser before production

## Cost

- **LibreTranslate**: 100% FREE! ✅
- **No API key required**: Works immediately
- **No rate limits**: Public API (reasonable use)
- **Self-hosting**: Optional, for production scale

## Support

- **LibreTranslate**: https://libretranslate.com
- **Docusaurus i18n**: https://docusaurus.io/docs/i18n/introduction
- **Script issues**: Check `scripts/translate-docs.js` comments

## Examples

### Workflow for Production Site

```bash
# 1. Write English documentation
# Edit docs/*.md files

# 2. Translate to all languages
npm run translate:all

# 3. Review translations
# Check i18n/ folders

# 4. Enable language switcher
# Edit docusaurus.config.ts

# 5. Test locally
npm start

# 6. Build for production
npm run build

# 7. Deploy
npm run deploy
```

### Quick Update Workflow

```bash
# Update one doc file
# Edit docs/intro.md

# Re-translate only Spanish
npm run translate:es

# Test
npm start
```

---

🎉 **That's it!** Your documentation is now available in multiple languages, completely free!
