// ==========================================
// CNN NEWS FUNCTIONAL CLONE
// ==========================================

const featuredNews =
    document.getElementById("featuredNews");

const worldNews =
    document.getElementById("worldNews");

const politicsNews =
    document.getElementById("politicsNews");

const businessNews =
    document.getElementById("businessNews");

const technologyNews =
    document.getElementById("technologyNews");

const sportsNews =
    document.getElementById("sportsNews");

const entertainmentNews =
    document.getElementById("entertainmentNews");

const breakingText =
    document.getElementById("breakingText");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const searchSection =
    document.getElementById("searchSection");

const searchResults =
    document.getElementById("searchResults");


let allArticles = [];


// ==========================================
// LOAD NEWS FROM EXPRESS API
// ==========================================

async function loadNews() {

    try {

        breakingText.textContent =
            "Loading latest headlines...";

        const response =
            await fetch("/api/news");

        if (!response.ok) {

            throw new Error(
                "Unable to load news from server."
            );

        }

        const data =
            await response.json();

        allArticles =
            data.articles || [];

        console.log(
            "News loaded:",
            allArticles
        );

        displayNews(allArticles);

    }

    catch (error) {

        console.error(
            "News loading error:",
            error
        );

        featuredNews.innerHTML = `
            <div class="error-message">
                <h3>Unable to load news</h3>
                <p>
                    Please make sure the Node.js server is running.
                </p>
            </div>
        `;

        breakingText.textContent =
            "Unable to load latest headlines.";

    }

}


// ==========================================
// CREATE NEWS CARD
// ==========================================

function createCard(article) {

    const card =
        document.createElement("article");

    card.className =
        "news-card";


    const image =
        article.image ||
        "https://via.placeholder.com/600x350";


    card.innerHTML = `

        <img
            src="${image}"
            alt="${article.title}"
            onerror="this.src='https://via.placeholder.com/600x350'"
        >

        <div class="card-content">

            <span class="category">
                ${article.category}
            </span>

            <h3>
                ${article.title}
            </h3>

            <p>
                ${article.description}
            </p>

            <div class="card-footer">

                <span>
                    ${article.date}
                </span>

                <button class="read-btn">
                    Read Article
                </button>

            </div>

        </div>
    `;


    const readButton =
        card.querySelector(".read-btn");


    readButton.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "selectedArticle",
                JSON.stringify(article)
            );

            window.location.href =
                "article.html";

        }
    );


    return card;

}


// ==========================================
// DISPLAY CATEGORY
// ==========================================

function displayCategory(
    container,
    articles,
    category
) {

    container.innerHTML = "";

    const categoryArticles =
        articles
            .filter(
                article =>
                    article.category === category
            )
            .slice(0, 4);


    if (categoryArticles.length === 0) {

        container.innerHTML = `
            <p class="no-news">
                No ${category} news available.
            </p>
        `;

        return;

    }


    categoryArticles.forEach(
        article => {

            container.appendChild(
                createCard(article)
            );

        }
    );

}


// ==========================================
// DISPLAY ALL NEWS
// ==========================================

function displayNews(articles) {

    featuredNews.innerHTML = "";

    searchSection.classList.add(
        "hidden"
    );


    // Breaking News

    if (articles.length > 0) {

        breakingText.textContent =
            articles[0].title;

    }


    // Top Stories

    const featured =
        articles.slice(0, 6);


    featured.forEach(
        article => {

            featuredNews.appendChild(
                createCard(article)
            );

        }
    );


    // Categories

    displayCategory(
        worldNews,
        articles,
        "World"
    );

    displayCategory(
        politicsNews,
        articles,
        "Politics"
    );

    displayCategory(
        businessNews,
        articles,
        "Business"
    );

    displayCategory(
        technologyNews,
        articles,
        "Technology"
    );

    displayCategory(
        sportsNews,
        articles,
        "Sports"
    );

    displayCategory(
        entertainmentNews,
        articles,
        "Entertainment"
    );

}


// ==========================================
// SEARCH
// ==========================================

function searchNews() {

    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    if (!query) {

        searchSection.classList.add(
            "hidden"
        );

        displayNews(allArticles);

        return;

    }


    const results =
        allArticles.filter(
            article => {

                const title =
                    article.title
                        ?.toLowerCase() || "";

                const description =
                    article.description
                        ?.toLowerCase() || "";

                const category =
                    article.category
                        ?.toLowerCase() || "";

                const content =
                    article.content
                        ?.toLowerCase() || "";


                return (
                    title.includes(query) ||
                    description.includes(query) ||
                    category.includes(query) ||
                    content.includes(query)
                );

            }
        );


    // Hide normal sections

    document
        .querySelectorAll("main > section:not(#searchSection)")
        .forEach(section => {

            section.classList.add(
                "hidden"
            );

        });


    // Show search section

    searchSection.classList.remove(
        "hidden"
    );


    searchResults.innerHTML = "";


    if (results.length === 0) {

        searchResults.innerHTML = `
            <div class="error-message">
                <h3>No results found</h3>
                <p>
                    Try searching for another keyword.
                </p>
            </div>
        `;

        return;

    }


    results.forEach(
        article => {

            searchResults.appendChild(
                createCard(article)
            );

        }
    );

}


// ==========================================
// SEARCH BUTTON
// ==========================================

searchBtn.addEventListener(
    "click",
    searchNews
);


// ==========================================
// SEARCH WITH ENTER KEY
// ==========================================

searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchNews();

        }

    }
);


// ==========================================
// LOAD APPLICATION
// ==========================================

loadNews();