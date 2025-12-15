// Vercel Serverless Function for Chatbot
// This handles chat requests using OpenAI API

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Get OpenAI API key from environment variable
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({
        error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your Vercel environment variables.'
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for the Physical AI & Humanoid Robotics course. Answer questions about robotics, AI, ROS 2, and autonomous systems clearly and concisely.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1024'),
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json({
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
      });
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || 'I could not generate a response.';

    return res.status(200).json({
      type: 'complete',
      content: answer,
      sources: []
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({
      error: `Error processing your request: ${error.message}`
    });
  }
}
