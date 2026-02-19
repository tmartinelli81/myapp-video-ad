const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIGS_DIR = path.join(__dirname, 'configs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(CONFIGS_DIR)) fs.mkdirSync(CONFIGS_DIR, { recursive: true });

function sanitize(str) {
  return String(str).replace(/[^a-zA-Z0-9_-]/g, '_');
}

app.get('/api/config/:orgId', (req, res) => {
  const file = path.join(CONFIGS_DIR, sanitize(req.params.orgId) + '.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
  } else {
    res.json({ youtubeUrl: '', minDuration: 10 });
  }
});

app.post('/api/config', (req, res) => {
  const { orgId, youtubeUrl, minDuration } = req.body;
  if (!orgId) return res.status(400).json({ error: 'orgId richiesto' });
  const file = path.join(CONFIGS_DIR, sanitize(orgId) + '.json');
  fs.writeFileSync(file, JSON.stringify({ youtubeUrl, minDuration }, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log('Server avviato sulla porta ' + PORT));
