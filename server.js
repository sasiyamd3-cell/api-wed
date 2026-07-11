const express = require('express');
const ytDlp = require('yt-dlp-exec');
const app = express();

// මෙතන තමයි කීස් පාලනය කරන්නේ
const API_KEYS = {
    'sasiya_test_01': { limit: 100 },
    'sasiya_vip_007': { limit: 9999 }
};

app.get('/api/download', async (req, res) => {
    const { apiKey, url } = req.query;

    // 1. Key එක චෙක් කිරීම
    if (!apiKey || !API_KEYS[apiKey]) {
        return res.status(401).json({ status: false, message: "Invalid API Key" });
    }

    // 2. Limit එක චෙක් කිරීම
    if (API_KEYS[apiKey].limit <= 0) {
        return res.status(403).json({ status: false, message: "Limit exceeded" });
    }

    try {
        const data = await ytDlp(url, { dumpSingleJson: true });
        
        // රিকোවෙස්ට් එක අඩු කිරීම (මේක ස්ථිර නෑ, සර්වර් එක රීස්ටාර්ට් වුණොත් ආපහු 100 වෙනවා)
        API_KEYS[apiKey].limit -= 1;

        res.json({
            status: true,
            title: data.title,
            download_url: data.url
        });
    } catch (e) {
        res.status(500).json({ status: false, message: "Error" });
    }
});

app.listen(process.env.PORT || 3000);
