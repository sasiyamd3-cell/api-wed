const express = require('express');
const ytDlp = require('yt-dlp-exec');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

//API Keys පාලනය
const API_KEYS = {
    'sasiya_test_01': { limit: 100 }
};

app.get('/api/download', async (req, res) => {
    const { apiKey, url } = req.query;

    if (!apiKey || !API_KEYS[apiKey]) {
        return res.status(401).json({ status: false, message: "Invalid API Key" });
    }

    if (API_KEYS[apiKey].limit <= 0) {
        return res.status(403).json({ status: false, message: "Limit exceeded" });
    }

    try {
        // yt-dlp හරහා ලින්ක් එක ලබාගැනීම
        const data = await ytDlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true
        });

        API_KEYS[apiKey].limit -= 1;

        res.json({
            status: true,
            brand: "Sasiya MD",
            title: data.title,
            thumbnail: data.thumbnail,
            download_url: data.url || (data.requested_formats ? data.requested_formats[0].url : "No direct URL")
        });
    } catch (e) {
        res.status(500).json({ status: false, message: "Could not fetch data. Ensure URL is valid." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
