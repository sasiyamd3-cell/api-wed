const express = require('express');
const ytDlp = require('yt-dlp-exec'); // හරියටම මේක තියෙන්න ඕනේ
const app = express();

// කීස් පාලනය
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
        // yt-dlp පාවිච්චි කරලා ලින්ක් එක ගන්න
        const data = await ytDlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            format: 'best' 
        });

        API_KEYS[apiKey].limit -= 1;

        res.json({
            status: true,
            brand: "Sasiya MD",
            title: data.title,
            download_url: data.url
        });
    } catch (e) {
        console.error(e); // ලොග් එකේ එරර් එක බලන්න උදව් වෙනවා
        res.status(500).json({ status: false, message: "Could not fetch data. Check your URL." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
