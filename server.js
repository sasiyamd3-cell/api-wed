const express = require('express');
const mongoose = require('mongoose');
const ytDlp = require('yt-dlp-exec'); // හැම එකටම පාවිච්චි කරන ටූල් එක
const rateLimit = require('express-rate-limit');

const app = express();
const mongoUri = 'mongodb+srv://cloud25588_db_user:RQxEbZhj74uGOtb4@cluster0.pptbqdr.mongodb.net/newdtzmini064771?appName=Cluster0';

mongoose.connect(mongoUri);

const ApiKey = mongoose.model('ApiKey', new mongoose.Schema({ key: String, remainingRequests: Number }));

// හැම එකකටම පොදු API එකක්
app.get('/api/download', async (req, res) => {
    const { apiKey, url } = req.query;

    try {
        // API Key Check
        const keyData = await ApiKey.findOne({ key: apiKey });
        if (!keyData || keyData.remainingRequests <= 0) return res.status(401).json({ status: false, message: "Invalid Key" });

        // ඕනෑම ලින්ක් එකකින් තොරතුරු ගැනීම
        const data = await ytDlp(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
        });

        // රিকোවෙස්ට් එක අඩු කරන්න
        keyData.remainingRequests -= 1;
        await keyData.save();

        res.json({
            status: true,
            brand: "Sasiya MD",
            title: data.title,
            thumbnail: data.thumbnail,
            download_url: data.url || data.requested_formats[0].url
        });
    } catch (e) {
        res.status(500).json({ status: false, message: "Link unsupported or failed" });
    }
});

app.listen(process.env.PORT || 3000);
