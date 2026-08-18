const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve the public folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
app.get("/api/news", (req, res) => {
    try {
        const filePath = path.join(__dirname, "data", "news.json");

        const newsData = fs.readFileSync(filePath, "utf8");
        const articles = JSON.parse(newsData);

        const formattedArticles = articles.map(article => ({
            id: article.id,
            title: article.title,
            description: article.description,
            content: article.content,
            author: article.author,
            publishedAt: article.date,
            urlToImage: article.image,
            url: "#",
            category: article.category,
            source: {
                name: article.category + " News"
            }
        }));

        res.json({
            status: "ok",
            totalResults: formattedArticles.length,
            articles: formattedArticles
        });

    } catch (error) {
        console.error("News Error:", error);

        res.status(500).json({
            error: "Unable to load news.json"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`CNN News Clone running at http://localhost:${PORT}`);
});