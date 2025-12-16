// LibreTranslate Translation Service
// 100% Free - No API Key Required!
// Public API: https://libretranslate.com
// You can also self-host: https://github.com/LibreTranslate/LibreTranslate

const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';
const LIBRETRANSLATE_LANGUAGES_URL = 'https://libretranslate.com/languages';

// Supported language codes (ISO 639-1)
export type SupportedLanguage =
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'ru' // Russian
  | 'ja' // Japanese
  | 'zh' // Chinese
  | 'ko' // Korean
  | 'ar' // Arabic
  | 'hi' // Hindi
  | 'nl' // Dutch
  | 'pl' // Polish
  | 'tr' // Turkish
  | 'sv' // Swedish
  | 'cs' // Czech
  | 'id' // Indonesian
  | 'uk' // Ukrainian
  | 'he'; // Hebrew

interface TranslationResponse {
  translatedText: string;
}

interface Language {
  code: string;
  name: string;
}

/**
 * Translate text using LibreTranslate API (100% Free!)
 * @param text - Text to translate
 * @param targetLang - Target language code (e.g., 'es', 'fr', 'de')
 * @param sourceLang - Source language code (defaults to 'auto' for auto-detection)
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage | 'auto' = 'auto'
): Promise<string> {
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

    const data: TranslationResponse = await response.json();
    return data.translatedText;
  } catch (error: any) {
    console.error('Translation error:', error);
    throw new Error(`Failed to translate text: ${error.message}`);
  }
}

/**
 * Translate multiple texts at once
 * @param texts - Array of texts to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (defaults to 'auto')
 * @returns Array of translated texts
 */
export async function translateTexts(
  texts: string[],
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage | 'auto' = 'auto'
): Promise<string[]> {
  try {
    // LibreTranslate doesn't support batch translation, so we do sequential requests
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang, sourceLang))
    );
    return translations;
  } catch (error: any) {
    console.error('Translation error:', error);
    throw new Error(`Failed to translate texts: ${error.message}`);
  }
}

/**
 * Get list of supported languages
 * @returns Array of supported languages with codes and names
 */
export async function getSupportedLanguages(): Promise<Language[]> {
  try {
    const response = await fetch(LIBRETRANSLATE_LANGUAGES_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const languages: Language[] = await response.json();
    return languages;
  } catch (error: any) {
    console.error('Error getting languages:', error);
    throw new Error(`Failed to get supported languages: ${error.message}`);
  }
}

/**
 * Detect the language of a given text
 * @param text - Text to detect language for
 * @returns Detected language code and confidence
 */
export async function detectLanguage(text: string): Promise<{ language: string; confidence: number }[]> {
  try {
    const response = await fetch('https://libretranslate.com/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Language detection error:', error);
    throw new Error(`Failed to detect language: ${error.message}`);
  }
}
