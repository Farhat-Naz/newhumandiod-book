/**
 * Auto-translate Docusaurus documentation using MyMemory API
 * FREE: 10,000 words/day - No credit card required
 * Just need email registration at https://mymemory.translated.net
 *
 * Usage:
 *   node scripts/translate-docs-mymemory.js [locale] [email]
 *   node scripts/translate-docs-mymemory.js es your@email.com
 */

const fs = require('fs').promises;
const path = require('path');

// MyMemory API configuration
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

// Get email from command line args
const args = process.argv.slice(2);
const targetLocale = args[0] || 'es';
const userEmail = args[1] || '';

// Supported locales
const SUPPORTED_LOCALES = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ar: 'ar-SA',
  ur: 'ur-PK',
  pt: 'pt-PT',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

const LOCALE_NAMES = {
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

// Track progress
let totalTranslations = 0;
let successfulTranslations = 0;
let failedTranslations = 0;

/**
 * Translate text using MyMemory API
 */
async function translateText(text, targetLang, sourceLang = 'en-US') {
  if (!text || text.trim().length === 0) {
    return text;
  }

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${sourceLang}|${targetLang}`,
    });

    // Add email for higher quota (optional but recommended)
    if (userEmail) {
      params.append('de', userEmail);
    }

    const url = `${MYMEMORY_API_URL}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 || data.responseStatus === '200') {
      successfulTranslations++;
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error) {
    failedTranslations++;
    console.error(`  ⚠ Translation error: ${error.message}`);
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
 * Translate frontmatter
 */
async function translateFrontmatter(frontmatter, targetLang) {
  const lines = frontmatter.split('\n');
  const translatedLines = [];

  for (const line of lines) {
    const titleMatch = line.match(/^(title|description|tagline):\s*['"]?(.+?)['"]?$/);
    if (titleMatch) {
      const field = titleMatch[1];
      const value = titleMatch[2];
      totalTranslations++;
      const translated = await translateText(value, targetLang);
      translatedLines.push(`${field}: "${translated}"`);
      await sleep(500); // Rate limit: 1 request per 0.5 sec
    } else {
      translatedLines.push(line);
    }
  }

  return translatedLines.join('\n');
}

/**
 * Translate markdown content
 */
async function translateMarkdown(content, targetLang) {
  // Preserve code blocks
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]+`)/g;
  const parts = [];
  const codeBlocks = [];
  let lastIndex = 0;
  let match;

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
      // Split into smaller chunks (MyMemory limit: 500 chars recommended)
      const chunks = splitIntoChunks(part, 400);
      for (const chunk of chunks) {
        totalTranslations++;
        const translated = await translateText(chunk, targetLang);
        translatedParts.push(translated);
        await sleep(600); // Rate limit: ~1.5 requests per second
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
 * Get all markdown files
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

    console.log(`  📄 ${path.basename(filePath)}...`);

    const translatedFrontmatter = frontmatter
      ? await translateFrontmatter(frontmatter, targetLang)
      : '';

    const translatedBody = await translateMarkdown(body, targetLang);

    const translatedContent = translatedFrontmatter
      ? `---\n${translatedFrontmatter}\n---\n${translatedBody}`
      : translatedBody;

    const relativePath = path.relative(DOCS_DIR, filePath);
    const outputPath = path.join(
      I18N_DIR,
      targetLocale,
      'docusaurus-plugin-content-docs',
      'current',
      relativePath
    );

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, translatedContent, 'utf-8');

    console.log(`  ✅ Translated successfully`);
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
  }
}

/**
 * Main
 */
async function main() {
  if (!SUPPORTED_LOCALES[targetLocale]) {
    console.error(`❌ Invalid locale: ${targetLocale}`);
    console.error(`Supported: ${Object.keys(SUPPORTED_LOCALES).join(', ')}`);
    process.exit(1);
  }

  console.log('🌍 MyMemory Translation - FREE 10,000 words/day\n');
  console.log(`Target: ${LOCALE_NAMES[targetLocale]} (${targetLocale})`);

  if (userEmail) {
    console.log(`Email: ${userEmail} (higher quota)`);
  } else {
    console.log('ℹ️  No email provided. For higher quota, add your email:');
    console.log(`   npm run translate:mymemory es your@email.com\n`);
  }

  const files = await getMarkdownFiles(DOCS_DIR);
  console.log(`\nFound ${files.length} files\n`);

  for (const file of files) {
    await translateFile(file, SUPPORTED_LOCALES[targetLocale]);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Translation Complete!\n');
  console.log(`Total API calls: ${totalTranslations}`);
  console.log(`Successful: ${successfulTranslations}`);
  console.log(`Failed: ${failedTranslations}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
