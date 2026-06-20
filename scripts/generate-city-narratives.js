const https = require('https');
const fs = require('fs');
const path = require('path');

// Uses CITY_CONTENT_API_KEY — completely separate from the blog's GROQ_API_KEY.
// This script never touches GROQ_API_KEY or daily-blog.yml.
const API_KEY = process.env.CITY_CONTENT_API_KEY;
const DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'city-details.json');

function callGroq(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 220,
      temperature: 0.8,
    });
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
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
          resolve(parsed.choices[0].message.content.trim());
        } catch (e) {
          reject(new Error('Parse error: ' + data.substring(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  if (!API_KEY) {
    console.error('CITY_CONTENT_API_KEY not set');
    process.exit(1);
  }

  const details = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const keys = Object.keys(details);
  console.log('Generating narratives for', keys.length, 'cities...');

  let done = 0;
  let failed = 0;

  for (const key of keys) {
    const city = details[key];

    // Skip cities that already have a narrative (lets the script resume safely if it stops partway)
    if (city.localInsight) { done++; continue; }

    const prompt = `Write exactly 2 sentences (max 55 words total) describing what it's actually like to own solar panels in ${city.name}, ${city.state}. ` +
      `Real context: ${city.climateType} climate, ${city.peakSunHours} peak sun hours/day, ${city.cloudyDaysPerYear} cloudy days/year, ${city.humidity}% humidity, $${city.avgElectricRate}/kWh electricity. ` +
      `Mention one specific, concrete detail a generic solar article wouldn't (e.g. a real local quirk tied to this climate or these numbers). ` +
      `Write in plain prose, no markdown, no quotes, no preamble like "Here is" — output ONLY the 2 sentences.`;

    try {
      const text = await callGroq(prompt);
      city.localInsight = text.replace(/^["']|["']$/g, '').trim();
      done++;
      console.log(`[${done}/${keys.length}] ${key} ✓`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] ${key}: ${err.message}`);
    }

    // Stay safely under Groq's 30 requests/minute free-tier limit
    await sleep(2200);

    // Save progress every 10 cities in case the job gets interrupted
    if (done % 10 === 0) {
      fs.writeFileSync(DATA_PATH, JSON.stringify(details, null, 2));
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(details, null, 2));
  console.log(`\nFinished. Success: ${done}, Failed: ${failed}`);
}

main();
