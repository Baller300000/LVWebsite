const container = document.getElementById("news-feed");
const select = document.getElementById("category");

async function loadNews(feedUrl) {
    container.innerHTML = "Loading news...";
    try {
        const res = await fetch(
            `/api/rss?url=${encodeURIComponent(feedUrl)}`
        );
        const data = await res.json();

        container.innerHTML = "";

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

loadNews(select.value);
select.addEventListener("change", () => loadNews(select.value));
