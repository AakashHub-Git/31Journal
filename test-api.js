const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.split('\n').find(l => l.includes('GOOGLE_GENERATIVE_AI_API_KEY')).split('=')[1].trim().replace(/\"/g, '');
process.env.GOOGLE_GENERATIVE_AI_API_KEY = key;
const { google } = require('@ai-sdk/google');
const { generateText } = require('ai');
(async () => {
  try {
    const res = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: 'hello'
    });
    console.log('1.5 works', res.text);
  } catch(e) {
    console.log('1.5 failed:', e.message);
  }
})();
