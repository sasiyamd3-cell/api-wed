const express = require('express');
const ytDlp = require('yt-dlp-exec');
const app = express();

// කස්ටමර්ලාගේ විස්තර පාලනය
const users = {
    'sasiya_vip_001': { coins: 21992 }
};

app.get('/api/download', async (req, res) => {
    const { apiKey, url } = req.query;

    // 1. API Key Check
    if (!apiKey || !users[apiKey]) {
        return res.json({ status: false, message: "Invalid API Key" });
    }

    // 2. Coins Check
    if (users[apiKey].coins <= 0) {
        return res.json({ status: false, message: "No coins left" });
    }

    try {
        // Media එක Fetch කිරීම
        const data = await ytDlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true
        });

        // Coins අඩු කිරීම
        users[apiKey].coins -= 1;

        // ඔයා ඉල්ලපු Format එකටම Response එක දීම
        res.json({
            status: true,
            data: {
                status: true,
                result: {
                    url: url,
                    title: data.title || "No Title",
                    thumbnail: data.thumbnail || "",
                    sd: data.url, 
                    hd: data.url 
                }
            },
            remainingCoins: users[apiKey].coins
        });
    } catch (e) {
        res.json({ status: false, message: "Download failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
