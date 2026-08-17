const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// NEWS API
// ===============================

app.get("/api/news", (req, res) => {

    try {

        const filePath = path.join(
            __dirname,
            "data",
            "news.json"
        );

        const newsData = fs.readFileSync(
            filePath,
            "utf8"
        );

        const news = JSON.parse(newsData);

        res.json({
            status: "ok",
            totalResults: news.length,
            articles: news
        });

    } catch (error) {

        console.error("News loading error:", error);

        res.status(500).json({
            status: "error",
            message: "Unable to load news."
        });

    }

});


// ===============================
// SINGLE ARTICLE API
// ===============================

app.get("/api/news/:id", (req, res) => {

    try {

        const filePath = path.join(
            __dirname,
            "data",
            "news.json"
        );

        const newsData = fs.readFileSync(
            filePath,
            "utf8"
        );

        const news = JSON.parse(newsData);

        const article = news.find(
            item => item.id == req.params.id
        );

        if (!article) {

            return res.status(404).json({
                error: "Article not found"
            });

        }

        res.json(article);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to load article"
        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `CNN News Clone running at http://localhost:${PORT}`
    );

});