// Public front-end config. This file ships to the browser, so it must never
// contain an API key. The DeepSeek key lives as a secret in the chat proxy
// (see chat-proxy/worker.js) — the site only knows the proxy's URL.
window.SITE_CONFIG = {
    chatEndpoint: "https://portfolio-chat.harishb2727.workers.dev"
};
