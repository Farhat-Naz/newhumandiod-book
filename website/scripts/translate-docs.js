/**
 * Auto-translate Docusaurus documentation using LibreTranslate
 *
 * Usage:
 *   node scripts/translate-docs.js [locale]
 *   node scripts/translate-docs.js es     # Translate to Spanish only
 *   node scripts/translate-docs.js        # Translate to all configured locales
 */

const fs = require('fs').promises;
const path = require('path');

// LibreTranslate API configuration
const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

// Supported locales from docusaurus.config.ts
const SUPPORTED_LOCALES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ar: 'Arabic',
  ur: 'Urdu',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
};

// Paths
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const I18N_DIR = path.join(__dirname, '..', 'i18n');

// Track translation progress
let totalFiles = 0;
let translatedFiles = 0;
let failedFiles = [];

/**
 * Translate text using LibreTranslate API
 */
async function translateText(text, targetLang, sourceLang = 'en') {
  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    const response = await fetch(LIBRETRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return text; // Return original text on error
  }
}

/**
 * Parse markdown frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: '', body: content };
  }

  return {
    frontmatter: match[1],
    body: match[2],
  };
}

/**
 * Translate markdown frontmatter fields
 */
async function translateFrontmatter(frontmatter, targetLang) {
  const lines = frontmatter.split('\n');
  const translatedLines = [];

  for (const line of lines) {
    // Translate title, description, and other text fields
    const titleMatch = line.match(/^(title|description|tagline):\s*['"]?(.+?)['"]?$/);
    if (titleMatch) {
      const field = titleMatch[1];
      const value = titleMatch[2];
      const translated = await translateText(value, targetLang);
      translatedLines.push(`${field}: "${translated}"`);

      // Add delay to avoid rate limiting
      await sleep(1000); // Increased to 1 second
    } else {
      translatedLines.push(line);
    }
  }

  return translatedLines.join('\n');
}

/**
 * Translate markdown content while preserving code blocks and links
 */
async function translateMarkdown(content, targetLang) {
  // Split by code blocks to preserve them
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
  const parts = [];
  const codeBlocks = [];
  let lastIndex = 0;
  let match;

  // Extract code blocks
  while ((match = codeBlockRegex.exec(content)) !== null) {
    parts.push(content.slice(lastIndex, match.index));
    codeBlocks.push(match[0]);
    parts.push(`__CODE_BLOCK_${codeBlocks.length - 1}__`);
    lastIndex = match.index + match[0].length;
  }
  parts.push(content.slice(lastIndex));

  // Translate non-code parts
  const translatedParts = [];
  for (const part of parts) {
    if (part.startsWith('__CODE_BLOCK_')) {
      translatedParts.push(part);
    } else if (part.trim().length > 0) {
      // Split into smaller chunks to avoid API limits
      const chunks = splitIntoChunks(part, 1000);
      for (const chunk of chunks) {
        const translated = await translateText(chunk, targetLang);
        translatedParts.push(translated);

        // Add delay to avoid rate limiting
        await sleep(2000); // Increased to 2 seconds
      }
    } else {
      translatedParts.push(part);
    }
  }

  // Restore code blocks
  let result = translatedParts.join('');
  codeBlocks.forEach((block, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return result;
}

/**
 * Split text into chunks
 */
function splitIntoChunks(text, maxLength) {
  const chunks = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get all markdown files recursively
 */
async function getMarkdownFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await getMarkdownFiles(fullPath)));
    } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Translate a single file
 */
async function translateFile(filePath, targetLang) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    console.log(`  Translating: ${path.basename(filePath)}...`);

    // Translate frontmatter
    const translatedFrontmatter = frontmatter
      ? await translateFrontmatter(frontmatter, targetLang)
      : '';

    // Translate body
    const translatedBody = await translateMarkdown(body, targetLang);

    // Combine
    const translatedContent = translatedFrontmatter
      ? `---\n${translatedFrontmatter}\n---\n${translatedBody}`
      : translatedBody;

    // Save to i18n folder
    const relativePath = path.relative(DOCS_DIR, filePath);
    const outputPath = path.join(
      I18N_DIR,
      targetLang,
      'docusaurus-plugin-content-docs',
      'current',
      relativePath
    );

    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write translated file
    await fs.writeFile(outputPath, translatedContent, 'utf-8');

    translatedFiles++;
    console.log(`  ✓ Saved to: i18n/${targetLang}/.../current/${relativePath}`);
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    failedFiles.push({ file: filePath, error: error.message });
  }
}

/**
 * Main translation function
 */
async function translateDocs(targetLocales) {
  console.log('🌍 Auto-Translate Docusaurus Documentation\n');
  console.log('Using LibreTranslate - 100% Free!\n');

  // Get all markdown files
  const files = await getMarkdownFiles(DOCS_DIR);
  totalFiles = files.length * targetLocales.length;

  console.log(`Found ${files.length} documentation files`);
  console.log(`Target languages: ${targetLocales.map(l => SUPPORTED_LOCALES[l]).join(', ')}\n`);

  // Translate for each locale
  for (const locale of targetLocales) {
    console.log(`\n📝 Translating to ${SUPPORTED_LOCALES[locale]} (${locale})...\n`);

    for (const file of files) {
      await translateFile(file, locale);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Translation Complete!\n');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Successfully translated: ${translatedFiles}`);
  console.log(`Failed: ${failedFiles.length}`);

  if (failedFiles.length > 0) {
    console.log('\n❌ Failed files:');
    failedFiles.forEach(({ file, error }) => {
      console.log(`  - ${path.basename(file)}: ${error}`);
    });
  }

  console.log('\n💡 Next steps:');
  console.log('1. Review translated files in i18n/ directory');
  console.log('2. Re-enable locale dropdown in docusaurus.config.ts');
  console.log('3. Run: npm start');
  console.log('4. Test language switching on your site');
  console.log('='.repeat(60));
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetLocales = args.length > 0 ? args : Object.keys(SUPPORTED_LOCALES);

// Validate locales
const invalidLocales = targetLocales.filter(l => !SUPPORTED_LOCALES[l]);
if (invalidLocales.length > 0) {
  console.error(`❌ Invalid locales: ${invalidLocales.join(', ')}`);
  console.error(`Supported: ${Object.keys(SUPPORTED_LOCALES).join(', ')}`);
  process.exit(1);
}

// Run translation
translateDocs(targetLocales).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
