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
      max_tokens: 1200,
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
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content);
        } catch(e) {
          reject(new Error('Groq parse error: ' + data.substring(0, 300)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function extractFields(raw) {
  // Clean up
  let text = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  // Extract title
  const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '';

  // Extract excerpt
  const excerptMatch = text.match(/"excerpt"\s*:\s*"([^"]+)"/);
  const excerpt = excerptMatch ? excerptMatch[1] : '';

  // Extract tags array
  const tagsMatch = text.match(/"tags"\s*:\s*\[([^\]]+)\]/);
  let tags = ['solar'];
  if (tagsMatch) {
    tags = tagsMatch[1].match(/"([^"]+)"/g)
      ? tagsMatch[1].match(/"([^"]+)"/g).map(t => t.replace(/"/g, ''))
      : ['solar'];
  }

  // Extract content - get everything between "content": " and the next field or end
  let content = '';
  const contentMatch = text.match(/"content"\s*:\s*"([\s\S]+?)(?:"\s*,\s*"(?:tags|title|excerpt)|"\s*\})/);
  if (contentMatch) {
    content = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
  } else {
    // Fallback: grab everything after "content":
    const fallback = text.match(/"content"\s*:\s*"([\s\S]+)/);
    if (fallback) {
      content = fallback[1].substring(0, 2000).replace(/\\n/g, '\n').replace(/\\"/g, '"');
    }
  }

  if (!title && !content) {
    throw new Error('Could not extract any fields from response');
  }

  return { title, excerpt, content, tags };
}

async function main() {
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set');
    process.exit(1);
  }

  const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  const keyword = pickKeyword(keywords);
  const slug = slugify(keyword);
  const date = new Date().toISOString().split('T')[0];

  console.log('Generating blog post for: "' + keyword + '"');

  const prompt = `Write a 400-word SEO blog post about: "${keyword}" for American homeowners.

Return ONLY a JSON object. No markdown. No code blocks. No text before or after. Use this exact format:
{"title":"your title here","excerpt":"one sentence summary","content":"<h2>Section 1</h2><p>text here</p><h2>Section 2</h2><p>text here</p><h2>Conclusion</h2><p>Visit SolarAtlas to find solar data for your city.</p>","tags":["solar","energy"]}

Keep content under 800 characters. No real newlines inside the JSON strings.`;

  let result;
  try {
    const raw = await callGroq(prompt);
    console.log('Preview: ' + raw.substring(0, 200));
    result = extractFields(raw);
  } catch(err) {
    console.error('Failed: ' + err.message);
    process.exit(1);
  }

  if (!fs.existsSync(BLOG_DATA_PATH)) {
    fs.mkdirSync(BLOG_DATA_PATH, { recursive: true });
  }

  const post = {
    slug: slug,
    title: result.title || keyword,
    excerpt: result.excerpt || '',
    content: result.content || '',
    tags: result.tags || ['solar'],
    keyword: keyword,
    date: date,
    published: true,
  };

  const outFile = path.join(BLOG_DATA_PATH, slug + '.json');
  fs.writeFileSync(outFile, JSON.stringify(post, null, 2));
  console.log('✅ Saved: data/blog/' + slug + '.json');
  console.log('Title: ' + post.title);
}

main();
