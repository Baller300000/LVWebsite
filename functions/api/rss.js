export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const rssUrl = url.searchParams.get("url");

    if (!rssUrl) {
        return new Response("Missing rss url", { status: 400 });
    }

    const apiKey = env.RSS2JSON_API_KEY;

    const apiUrl =
        "https://api.rss2json.com/v1/api.json" +
        "?rss_url=" + encodeURIComponent(rssUrl) +
        "&api_key=" + apiKey;

    try {
        const res = await fetch(apiUrl);
        const data = await res.text();

        return new Response(data, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (err) {
        return new Response("Failed to fetch RSS", { status: 500 });
    }
}
