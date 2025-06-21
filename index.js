const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true
    });
    const bestFormat = info.formats.find(f => f.url && f.ext === 'mp4');
    if (!bestFormat) return res.status(404).json({ error: 'Video format not found' });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      downloadUrl: bestFormat.url
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`VidDropX Backend running on port ${PORT}`);
});
