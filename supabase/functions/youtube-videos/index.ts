// Edge function: fetches Geotech4All YouTube channel videos via public RSS feed.
// No API key required. Avoids CORS issues by proxying server-side.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CHANNEL_ID = "UCoBtHegHcrvw8ILgoCSNkVQ"; // Geotech4All
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  published: string;
  author: string;
}

function extract(tag: string, xml: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

function extractAttr(tag: string, attr: string, xml: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`));
  return m ? m[1] : "";
}

function parseFeed(xml: string): VideoEntry[] {
  const entries = xml.split("<entry>").slice(1);
  return entries.map((raw) => {
    const block = raw.split("</entry>")[0];
    const videoId = extract("yt:videoId", block);
    const title = extract("title", block);
    const published = extract("published", block);
    const author = extract("name", block);
    const description = extract("media:description", block);
    const thumbnail =
      extractAttr("media:thumbnail", "url", block) ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    return {
      id: videoId,
      title,
      description,
      thumbnail,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      published,
      author,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const res = await fetch(FEED_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Geotech4AllBot/1.0; +https://geotech4all.com)",
      },
    });

    if (!res.ok) {
      throw new Error(`YouTube feed fetch failed: ${res.status}`);
    }

    const xml = await res.text();
    const videos = parseFeed(xml);

    return new Response(
      JSON.stringify({ success: true, videos, count: videos.length }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=1800", // 30 min cache
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("youtube-videos error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message, videos: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
