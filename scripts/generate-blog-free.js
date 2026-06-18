const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const KEYWORDS_PATH = path.join(__dirname, 'keywords.json');
const BLOG_DATA_PATH = path.join(__dirname, '..', 'data', 'blog');

// ── Helpers ──────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pickKeyword(keywords) {
  // Avoid repeating recent keywords
  const usedPath = path.join(__dirname, '.used_keywords.json');
  let used = [];
  if (fs.existsSync(usedPath)) {
    try { used = JSON.parse(fs.readFileSync(usedPath, 'utf8')); } catch {}
  }
  const available = keywords.filter(k => !used.includes(k));
  const pool = available.length > 0 ? available : keywords;
  const keyword = pool[Math.floor(Math.random() * pool.length)];
  // Track last 20 used
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

// ── Main ──────────────────────────────────────────────────
async function main() {
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY not set');
    process.exit(1);
  }

  // Load keywords
  const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  const keyword = pickKeyword(keywords);
  const slug = slugify(keyword);
  const date = new Date().toISOString().split('T')[0];

  console.log(`📝 Generating blog post for: "${keyword}"`);

  // Build prompt
  const prompt = `Write a detailed, SEO-optimized blog post about: "${keyword}"

Requirements:
- Title: compelling, includes the keyword
- Length: 600-900 words
- Structure: introduction, 3-4 sections with headers, conclusion
- Tone: helpful, informative, written for American homeowners
- Include practical tips and real numbers where relevant
- End with a call to action to use SolarAtlas to find local solar data

Return ONLY a JSON object (no markdown, no code blocks) with these exact fields:
{
  "title": "...",
  "excerpt": "...(2 sentences, 150 chars max)...",
  "content": "...(full HTML content using <h2>, <p>, <ul>, <li> tags)...",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  let result;
  try {
    const raw = await callGroq(prompt);

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    result = JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ Failed to generate/parse blog post:', err.message);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(BLOG_DATA_PATH)) {
    fs.mkdirSync(BLOG_DATA_PATH, { recursive: true });
  }

  // Build post object
  const post = {
    slug,
    title: result.title || keyword,
    excerpt: result.excerpt || '',
    content: result.content || '',
    tags: result.tags || ['solar'],
    keyword,
    date,
    published: true,
  };

  // Save to file
  const outFile = path.join(BLOG_DATA_PATH, `${slug}.json`);
  fs.writeFileSync(outFile, JSON.stringify(post, null, 2));

  console.log(`✅ Blog post saved: data/blog/${slug}.json`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Date:  ${post.date}`);
}

main();
