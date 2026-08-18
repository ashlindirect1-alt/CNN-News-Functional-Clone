// ===============================
// CNN NEWS FUNCTIONAL CLONE
// ===============================

const featuredNews = document.getElementById("featuredNews");
const worldNews = document.getElementById("worldNews");
const politicsNews = document.getElementById("politicsNews");
const businessNews = document.getElementById("businessNews");
const technologyNews = document.getElementById("technologyNews");
const sportsNews = document.getElementById("sportsNews");
const entertainmentNews = document.getElementById("entertainmentNews");

const breakingText = document.getElementById("breakingText");

let allArticles = [];


// ===============================
// LOAD NEWS
// ===============================

async function loadNews() {

    try {

        const response = await fetch("/api/news");

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load news");
        }

        allArticles = data.articles || [];

        console.log("News loaded:", allArticles);

        displayNews(allArticles);

    } catch (error) {

        console.error("News loading error:", error);

        featuredNews.innerHTML = `
            <div class="news-card">
                <div class="card-content">
                    <h3>Unable to load news</h3>
                    <p>
                        Please make sure the Node.js server is running.
                    </p>
                </div>
            </div>
        `;

        breakingText.textContent =
            "Unable to load latest headlines.";
    }
}


// ===============================
// CREATE NEWS CARD
// ===============================

function createCard(article) {

    const card = document.createElement("article");

    card.className = "news-card";

    const image =
        article.image ||
        article.urlToImage ||
        "https://via.placeholder.com/600x350";

    card.innerHTML = `

        <img
            src="${image}"
            alt="News image"
            onerror="this.src='https://via.placeholder.com/600x350'"
        >

        <div class="card-content">

            <span>
                ${article.category || "News"}
            </span>

            <h3>
                ${article.title}
            </h3>

            <p>
                ${article.description || "Read the latest news story."}
            </p>

            <button class="read-btn">
                Read Article
            </button>

        </div>
    `;


    card
        .querySelector(".read-btn")
        .addEventListener("click", () => {

            localStorage.setItem(
                "selectedArticle",
                JSON.stringify(article)
            );

            window.location.href = "article.html";
        });


    return card;
}


// ===============================
// DISPLAY NEWS
// ===============================

function displayNews(articles) {

    featuredNews.innerHTML = "";
    worldNews.innerHTML = "";
    politicsNews.innerHTML = "";
    businessNews.innerHTML = "";
    technologyNews.innerHTML = "";
    sportsNews.innerHTML = "";
    entertainmentNews.innerHTML = "";


    // Breaking News

    if (articles.length > 0) {

        breakingText.textContent =
            articles[0].title;

    } else {

        breakingText.textContent =
            "No news available.";
    }


    // ===========================
    // TOP STORIES
    // ===========================

    articles
        .slice(0, 6)
        .forEach(article => {

            featuredNews.appendChild(
                createCard(article)
            );

        });


    // ===========================
    // WORLD
    // ===========================

    displayCategory(
        articles,
        "World",
        worldNews
    );


    // ===========================
    // POLITICS
    // ===========================

    displayCategory(
        articles,
        "Politics",
        politicsNews
    );


    // ===========================
    // BUSINESS
    // ===========================

    displayCategory(
        articles,
        "Business",
        businessNews
    );


    // ===========================
    // TECHNOLOGY
    // ===========================

    displayCategory(
        articles,
        "Technology",
        technologyNews
    );


    // ===========================
    // SPORTS
    // ===========================

    displayCategory(
        articles,
        "Sports",
        sportsNews
    );


    // ===========================
    // ENTERTAINMENT
    // ===========================

    displayCategory(
        articles,
        "Entertainment",
        entertainmentNews
    );
}


// ===============================
// DISPLAY CATEGORY
// ===============================

function displayCategory(
    articles,
    category,
    container
) {

    const filteredArticles =
        articles
            .filter(article =>
                article.category?.toLowerCase() ===
                category.toLowerCase()
            )
            .slice(0, 4);


    filteredArticles.forEach(article => {

        container.appendChild(
            createCard(article)
        );

    });
}


// ===============================
// SEARCH
// ===============================

const searchBtn =
    document.getElementById("searchBtn");

const searchInput =
    document.getElementById("searchInput");


searchBtn.addEventListener(
    "click",
    searchNews
);


searchInput.addEventListener(
    "keypress",
    event => {

        if (event.key === "Enter") {
            searchNews();
        }

    }
);


function searchNews() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!query) {

        displayNews(allArticles);

        return;
    }


    const results =
        allArticles.filter(article =>

            article.title
                ?.toLowerCase()
                .includes(query)

            ||

            article.description
                ?.toLowerCase()
                .includes(query)

            ||

            article.category
                ?.toLowerCase()
                .includes(query)
        );


    displayNews(results);
}


// ===============================
// START
// ===============================

loadNews();