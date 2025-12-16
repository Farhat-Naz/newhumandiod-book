# Migration Guide: Firebase → Clerk + LibreTranslate

This project has been migrated from Firebase to **Clerk** (authentication) and **LibreTranslate** (translation).

## Setup Instructions

### 1. Clerk Authentication Setup

#### Get Your Clerk API Keys
1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application in the dashboard
3. Copy your **Publishable Key** from the API Keys section

#### Configure OAuth Providers (Optional)
To enable Google Sign-In:
1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Enable **Google**
3. Follow the instructions to set up Google OAuth credentials

#### Environment Variables
Create a `.env` file in the `website` directory:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### 2. LibreTranslate Translation Setup

#### No API Key Required! 🎉
LibreTranslate is **100% free** and requires **no registration or API key**!

- **Public API**: Uses `https://libretranslate.com`
- **Completely Free**: No credit card, no signup, no limits
- **Open Source**: You can self-host for unlimited usage
- **20+ Languages**: Supports major world languages

#### Optional: Self-Hosting
For production apps with high volume, you can self-host LibreTranslate:
1. Visit [https://github.com/LibreTranslate/LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
2. Follow the installation guide
3. Update `LIBRETRANSLATE_API_URL` in `src/services/translation.ts`

### 3. Start the Development Server

```bash
npm start
```

## What Changed?

### Authentication
- **Removed**: Firebase Auth
- **Added**: Clerk Authentication
- **Features**:
  - Email/Password authentication
  - Google OAuth
  - Built-in user management
  - Session handling

### Translation
- **Added**: LibreTranslate API integration (100% Free!)
- **Location**: `src/services/translation.ts`
- **Features**:
  - High-quality translations
  - Support for 20+ languages
  - Language detection
  - Batch translation support
  - No API key required!

## Using the Translation Service

### Basic Translation

```typescript
import { translateText } from './services/translation';

// Translate to Spanish (auto-detect source language)
const translated = await translateText('Hello, world!', 'es');

// Translate with specific source language
const translated = await translateText('Hello, world!', 'es', 'en');
```

### Batch Translation

```typescript
import { translateTexts } from './services/translation';

const texts = ['Hello', 'Goodbye', 'Thank you'];
const translations = await translateTexts(texts, 'es');
```

### Language Detection

```typescript
import { detectLanguage } from './services/translation';

const result = await detectLanguage('Hello, world!');
console.log(result); // [{ language: 'en', confidence: 0.99 }]
```

### Get Supported Languages

```typescript
import { getSupportedLanguages } from './services/translation';

const languages = await getSupportedLanguages();
// Returns: [{ code: 'en', name: 'English' }, ...]
```

### Supported Languages

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi
- `nl` - Dutch
- `pl` - Polish
- `tr` - Turkish
- `sv` - Swedish
- `cs` - Czech
- `id` - Indonesian
- `uk` - Ukrainian
- `he` - Hebrew
- And many more...

## Authentication API

The authentication API remains the same, so your existing components continue to work:

```typescript
import { useAuth } from './components/Auth/AuthContext';

function MyComponent() {
  const { currentUser, login, signup, logout, loginWithGoogle } = useAuth();

  // All methods work exactly as before
}
```

## Files Modified

- ✅ `src/components/Auth/AuthContext.tsx` - Migrated to Clerk
- ✅ `src/components/Auth/clerk.ts` - New Clerk config
- ✅ `src/services/translation.ts` - New DeepL service
- ✅ `src/Root.tsx` - Added ClerkProvider
- ✅ `package.json` - Updated dependencies
- ✅ `.gitignore` - Added `.env`
- ❌ `src/components/Auth/firebase.ts` - Deleted

## Troubleshooting

### Clerk Not Loading
- Check that `CLERK_PUBLISHABLE_KEY` is set in `.env`
- Ensure the key starts with `pk_test_` or `pk_live_`
- Restart the development server after adding environment variables

### Translation Not Working
- LibreTranslate uses a public API - no configuration needed!
- If the public API is slow or unavailable, consider self-hosting
- For CORS issues in browser, you may need to proxy requests through your backend
- Check network connectivity to `https://libretranslate.com`

### Google OAuth Not Working
- Enable Google in Clerk Dashboard
- Configure OAuth redirect URLs in Google Cloud Console
- Ensure your app is running on the correct domain/port

## Production Deployment

### Environment Variables
Set these in your hosting provider:
- `CLERK_PUBLISHABLE_KEY` (get from Clerk Dashboard)

### Clerk Production Setup
1. Switch to production keys in Clerk Dashboard
2. Update OAuth redirect URLs for production domain
3. Configure allowed domains in Clerk settings

### LibreTranslate Production Setup
For production apps with high traffic, consider:
1. **Self-hosting LibreTranslate** for unlimited usage and better performance
2. **API Proxy**: Route translation requests through your backend to avoid CORS
3. **Caching**: Cache frequently translated content to reduce API calls
4. **Rate Limiting**: Implement client-side rate limiting for public API

## Support

- **Clerk Docs**: [https://clerk.com/docs](https://clerk.com/docs)
- **LibreTranslate API**: [https://libretranslate.com](https://libretranslate.com)
- **LibreTranslate GitHub**: [https://github.com/LibreTranslate/LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
- **Free Tier**:
  - Clerk: 10,000 Monthly Active Users (MAU) - Free
  - LibreTranslate: Unlimited - 100% Free!
