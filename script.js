const quotes = [
  "Zindagi ko shuffle pe rakho.",
  "Chai garam ho ya yaadein — dono aaram se.",
  "Har gaane ki apni ek gali hoti hai.",
  "Thoda ruk jao. Duniya kahin bhaagi nahi ja rahi.",
  "Purane gaane, naye bahane.",
  "Aaj ka plan: ek aur gaana."
];

const quoteText = document.getElementById("quote-text");
document.getElementById("new-quote").addEventListener("click", () => {
  const current = quoteText.textContent;
  const choices = quotes.filter(q => q !== current);
  quoteText.textContent = choices[Math.floor(Math.random() * choices.length)];
});

document.getElementById("year").textContent = new Date().getFullYear();

function getYouTubeEmbed(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return null; }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const allowed = ["youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "youtube-nocookie.com"];
  if (!allowed.some(domain => host === domain || host.endsWith("." + domain))) return null;

  const params = new URLSearchParams();
  let videoId = "";
  let playlistId = "";

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] || "";
  } else {
    videoId = url.searchParams.get("v") || "";
    if (!videoId) {
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex(p => ["embed", "shorts", "live"].includes(p));
      if (embedIndex >= 0) videoId = parts[embedIndex + 1] || "";
    }
  }
  playlistId = url.searchParams.get("list") || "";

  if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) params.set("v", videoId);
  if (playlistId && /^[a-zA-Z0-9_-]+$/.test(playlistId)) params.set("list", playlistId);
  if (!params.has("v") && !params.has("list")) return null;

  // Use YouTube's official embed endpoint; never download or extract media.
  const query = new URLSearchParams();
  if (params.has("v")) query.set("v", params.get("v"));
  if (params.has("list")) query.set("list", params.get("list"));
  query.set("rel", "0");
  query.set("playsinline", "1");
  return "https://www.youtube-nocookie.com/embed/" +
    (params.has("v") ? encodeURIComponent(params.get("v")) : "videoseries") +
    "?" + query.toString();
}

const form = document.getElementById("youtube-form");
const input = document.getElementById("youtube-url");
const message = document.getElementById("form-message");
const embedWrap = document.getElementById("embed-wrap");

form.addEventListener("submit", event => {
  event.preventDefault();
  const embedUrl = getYouTubeEmbed(input.value.trim());
  if (!embedUrl) {
    message.textContent = "That link doesn't look like a supported YouTube video or playlist. Please check it and try again.";
    message.style.color = "#f0a083";
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = "YouTube music player";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  embedWrap.replaceChildren(iframe);
  message.textContent = "Player loaded. Press play in the YouTube player to start listening.";
  message.style.color = "#b9d3a1";
  embedWrap.scrollIntoView({ behavior: "smooth", block: "center" });
});
