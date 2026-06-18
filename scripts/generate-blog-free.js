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
    try { used = JSON.parse(fs.readFileSync(usedPath, 'utf8')); } catch(e) {}
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
        'Authorization': 'Bearer ' + GROQ_API_KEY,
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          var parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content);
        } catch(e) {
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
  var cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  try {
    return JSON.parse(cleaned);
  } catch(e1) {
    var match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch(e2) {
        var escaped = match[0].replace(/("(?:[^"\\]|\\.)*")/g, function(m) {
          return m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        });
        try {
          return JSON.parse(escaped);
        } catch(e3) {
          throw new Error('Could not parse JSON: ' + e3.message);
        }
      }
    }
    throw new Error('No JSON object found in response');
  }
}

async function main() {
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set');
    process.exit(1);
  }
  var keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  var keyword = pickKeyword(keywords);
  var slug = slugify(keyword);
  var date = new Date().toISOString().split('T')[0];
  console.log('Generating blog post for: "' + keyword + '"');
  var prompt = 'Write a blog post about: "' + keyword + '". Return ONLY a JSON object with no markdown, no code blocks. Format: {"title":"...","excerpt":"...","content":"...html content on one line...","tags":["tag1","tag2"]}. The content must be a single line string with no real newlines inside it.';
  var result;
  try {
    var raw = await callGroq(prompt);
    console.log('Response preview: ' + raw.substring(0, 150));
    result = safeParseJSON(raw);
  } catch(err) {
    console.error('Failed: ' + err.message);
    process.exit(1);
  }
  if (!fs.existsSync(BLOG_DATA_PATH)) {
    fs.mkdirSync(BLOG_DATA_PATH, { recursive: true });
  }
  var post = {
    slug: slug,
    title: result.title || keyword,
    excerpt: result.excerpt || '',
    content: result.content || '',
    tags: result.tags || ['solar'],
    keyword: keyword,
    date: date,
    published: true,
  };
  var outFile = path.join(BLOG_DATA_PATH, slug + '.json');
  fs.writeFileSync(outFile, JSON.stringify(post, null, 2));
  console.log('Blog post saved: data/blog/' + slug + '.json');
  console.log('Title: ' + post.title);
}

main();
