const express = require('express');
const ytDlp = require('yt-dlp-exec');
const app = express();

const users = { 'sasiya_vip_001': { coins: 21992 } };

app.get('/api/download', async (req, res) => {
    const { apiKey, url } = req.query;
    if (!apiKey || !users[apiKey]) return res.json({ status: false, message: "Invalid API Key" });
    if (users[apiKey].coins <= 0) return res.json({ status: false, message: "No coins left" });

    try {
        const data = await ytDlp(url, { dumpSingleJson: true });
        users[apiKey].coins -= 1;
        res.json({
            status: true,
            data: {
                status: true,
                result: {
                    url: url,
                    title: data.title || "No Title",
                    thumbnail: data.thumbnail || "",
                    sd: data.url || "",
                    hd: data.url || ""
                }
            },
            remainingCoins: users[apiKey].coins
        });
    } catch (e) {
        res.json({ status: false, message: "Download failed" });
    }
});

app.listen(process.env.PORT || 3000);
