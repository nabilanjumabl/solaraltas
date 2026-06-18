const https = require('https');
const fs = require('fs');
const path = require('path');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const KEYWORDS_PATH = path.join(__dirname, 'keywords.json');
const BLOG_DATA_PATH = path.join(__dirname, '..', 'data', 'blog');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pickKeyword(keywords) {
  const usedPath = path.join(__dirname, '.used_keywords.json');
  let used = [];
  if (fs.existsSync(usedPath)) {
    try { used = JSON.parse(fs.readFileSync(usedPath, 'utf8')); } catch {}
  }
  const available = keywords.filter(k => !used.includes(k));
  const pool = available.length > 0 ? available : keywords;
  const keyword = pool[Math.floor(Math.random() * pool.length)];
  used = [keyword, ...used].slice(0, 20);
  fs.writeFileSync(usedPath, JSON.stringify(used));
  return keyword;
}

function callGroq(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1800,
      temperature: 0.7,
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content);
        } catch (e) {
          reject(new Error('Failed to parse Groq response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function safeParseJSON(raw) {
  // Strip markdown code fences
  let cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Remove control characters that break JSON.parse
  // but preserve newlines inside HTML content by escaping them
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // Try extracting just the JSON object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        // Last resort: manually escape newlines inside string values
        const escaped = match[0].replace(/("(?:[^"\\]|\\.)*")/g, (m) => {
          return m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        });
        try {
          return JSON.parse(escaped);
        } catch (e3) {
          throw new Error('Could not parse JSON after all attempts: ' + e3.message);
        }
      }
    }
    throw new Error('No JSON object found in response');
  }
}

async function main() {
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not set');
    process.exit(1);
  }

  const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  const keyword = pickKeyword(keywords);
  const slug = slugify(keyword);
  const date = new Date().toISOString().split('T')[0];

  console.log(`📝 Generating blog post for: "${keyword}"`);

  const prompt = `Write a detailed, SEO-optimized blog post about: "${keyword}"

Requirements:
- Title: compelling, includes the keyword
- Length: 600-900 words
- Tone: helpful, informative, written for American homeowners
- End with a call to action to use SolarAtlas

Return ONLY valid JSON (no markdown, no code blocks, no extra text) exactly like this:
{"title":"...","excerpt":"...2 sentences max...","content":"...full content as one HTML string with h2 and p tags...","tags":["tag1","tag2","tag3"]}

IMPORTANT: The content field must be a single-line JSON string. Replace all newlines with spaces inside the content value.`;

  let result;
  try {
    const raw = await callGroq(prompt);
    console.log('Raw response preview:', raw.substring(0, 200));
    result = safeParseJSON(raw);
  } catch (err) {
    console.error('❌ Failed to generate/parse blog post:', err.message);
    process.exit(1);
  }

  if (!fs.existsSync(BLOG_DATA_PATH)) {
    fs.mkdirSync(BLOG_DATA_PATH, { recursive: true });
  }

  const post = {
    slug,
    title: result.title || keyword,
    excerpt: result.excerpt || '',
    content: result.content || '',
    tags: result.tags || ['solar'],
