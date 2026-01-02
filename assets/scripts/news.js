const container = document.getElementById("news-feed");
const select = document.getElementById("category");
const API_KEY = "mqtljkkgzunqiemhne3uw25tkuaznldfwnkhxcx0";

async function loadNews(feedUrl) {
    container.innerHTML = "Loading news...";
    try {
        const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=${API_KEY}`
        );
        const data = await res.json();

        container.innerHTML = ""; // clear previous news

        if (!data.items || data.items.length === 0) {
            container.innerHTML = "No news found.";
            return;
        }

        data.items.forEach(item => {
            const article = document.createElement("article");
            article.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.description}</p>
                <small>${new Date(item.pubDate).toLocaleString()}</small>
            `;
            container.appendChild(article);
        });
    } catch (err) {
        container.innerHTML = "Failed to load news.";
        console.error(err);
    }
}

// load initial feed
loadNews(select.value);

// reload when category changes
select.addEventListener("change", () => loadNews(select.value));
