import React, { useState } from 'react';
import { translateText, getSupportedLanguages } from '../../services/translation';

/**
 * Example component showing how to use the LibreTranslate service
 * 100% Free - No API Key Required!
 */
export default function TranslationExample() {
  const [inputText, setInputText] = useState('Hello, world!');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTranslate() {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const result = await translateText(inputText, targetLang as any);
      setTranslatedText(result);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Translation Example</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Powered by LibreTranslate - 100% Free!
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Text to Translate:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          placeholder="Enter text to translate..."
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Target Language:
        </label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
          <option value="ko">Korean</option>
          <option value="ar">Arabic</option>
          <option value="hi">Hindi</option>
          <option value="nl">Dutch</option>
          <option value="pl">Polish</option>
          <option value="tr">Turkish</option>
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
        }}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c33',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}

      {translatedText && (
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Translation:
          </label>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px',
              fontSize: '16px',
              lineHeight: '1.5',
            }}
          >
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
}
